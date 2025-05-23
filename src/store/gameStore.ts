import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, GameSettings, HighScore, Tetromino } from '../types'
import { TETROMINO_SHAPES, BOARD_WIDTH, BOARD_HEIGHT } from '../types'
import { soundManager } from '../utils/soundManager'

interface GameStore extends GameState {
  settings: GameSettings
  highScores: HighScore[]
  combo: number
  lastClearTime: number
  clearingLines: number[]
  nextPieces: Tetromino[]
  
  // Actions
  initBoard: () => void
  createPiece: () => Tetromino
  spawnPiece: () => void
  movePiece: (dx: number, dy: number) => boolean
  rotatePiece: () => void
  hardDrop: () => void
  holdPiece: () => void
  checkCollision: (piece: Tetromino, dx?: number, dy?: number) => boolean
  placePiece: () => void
  clearLines: () => void
  updateScore: (linesCleared: number) => void
  startGame: () => void
  pauseGame: () => void
  endGame: () => void
  resetGame: () => void
  updateSettings: (settings: Partial<GameSettings>) => void
  addHighScore: (score: HighScore) => void
  toggleSound: () => void
  setVolume: (volume: number) => void
}

const createEmptyBoard = (): (string | null)[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
}

const defaultSettings: GameSettings = {
  music: true,
  soundEffects: true,
  volume: 0.7,
  controls: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    softDrop: 'ArrowDown',
    hardDrop: 'Space',
    rotate: 'ArrowUp',
    hold: 'KeyC',
    pause: 'KeyP',
  },
  theme: 'luxury',
}

// Add custom event types
const emitGameEvent = (eventName: string, detail?: any) => {
  const event = new CustomEvent(eventName, { detail });
  document.dispatchEvent(event);
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      board: createEmptyBoard(),
      currentPiece: null,
      nextPieces: [],
      heldPiece: null,
      score: 0,
      level: 1,
      lines: 0,
      combo: 0,
      lastClearTime: 0,
      clearingLines: [],
      gameStatus: 'menu',
      dropTime: 0,
      dropInterval: 1000,
      settings: defaultSettings,
      highScores: [],

      // Actions
      initBoard: () => set({ board: createEmptyBoard() }),

      createPiece: () => {
        const shapes = Object.keys(TETROMINO_SHAPES)
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
        const tetromino = TETROMINO_SHAPES[randomShape]
        
        return {
          ...tetromino,
          position: {
            x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
            y: 0,
          },
          rotation: 0,
        }
      },

      spawnPiece: () => {
        const state = get()
        let nextPieces = [...state.nextPieces]
        
        // If we don't have enough next pieces, generate new ones
        while (nextPieces.length < 5) {
          nextPieces.push(state.createPiece())
        }

        const newPiece = nextPieces.shift() || state.createPiece()

        if (state.checkCollision(newPiece)) {
          soundManager.playSound('gameOver')
          set({ gameStatus: 'gameOver' })
          return
        }

        set({
          currentPiece: newPiece,
          nextPieces: nextPieces,
        })
      },

      movePiece: (dx: number, dy: number) => {
        const state = get()
        if (!state.currentPiece || state.gameStatus !== 'playing') return false

        const newPiece = {
          ...state.currentPiece,
          position: {
            x: state.currentPiece.position.x + dx,
            y: state.currentPiece.position.y + dy,
          },
        }

        if (!state.checkCollision(newPiece)) {
          set({ currentPiece: newPiece })
          if (dx !== 0) soundManager.playSound('move')
          return true
        }
        return false
      },

      rotatePiece: () => {
        const state = get()
        if (!state.currentPiece || state.gameStatus !== 'playing') return

        // Get rotated shape
        const rotated = state.currentPiece.shape[0].map((_, i) =>
          state.currentPiece!.shape.map(row => row[i]).reverse()
        )

        // Try normal rotation
        const newPiece = {
          ...state.currentPiece,
          shape: rotated,
        }

        // If normal rotation fails, try wall kicks
        if (state.checkCollision(newPiece)) {
          // Try moving left
          if (!state.checkCollision(newPiece, -1, 0)) {
            set({ 
              currentPiece: {
                ...newPiece,
                position: {
                  x: state.currentPiece.position.x - 1,
                  y: state.currentPiece.position.y
                }
              }
            })
            soundManager.playSound('rotate')
            return
          }
          // Try moving right
          if (!state.checkCollision(newPiece, 1, 0)) {
            set({ 
              currentPiece: {
                ...newPiece,
                position: {
                  x: state.currentPiece.position.x + 1,
                  y: state.currentPiece.position.y
                }
              }
            })
            soundManager.playSound('rotate')
            return
          }
          // Try moving up (in case we're at the bottom)
          if (!state.checkCollision(newPiece, 0, -1)) {
            set({ 
              currentPiece: {
                ...newPiece,
                position: {
                  x: state.currentPiece.position.x,
                  y: state.currentPiece.position.y - 1
                }
              }
            })
            soundManager.playSound('rotate')
            return
          }
        } else {
          set({ currentPiece: newPiece })
          soundManager.playSound('rotate')
        }
      },

      hardDrop: () => {
        const state = get()
        if (!state.currentPiece || state.gameStatus !== 'playing') return

        let dropDistance = 0
        while (state.movePiece(0, 1)) {
          dropDistance++
        }

        set(state => ({
          score: state.score + dropDistance * 2,
        }))

        soundManager.playSound('hardDrop')
        emitGameEvent('hardDrop')
        state.placePiece()
      },

      holdPiece: () => {
        const state = get()
        if (!state.currentPiece || state.gameStatus !== 'playing') return

        if (state.heldPiece) {
          const temp = state.heldPiece
          set({
            heldPiece: { ...state.currentPiece, position: { x: 0, y: 0 } },
            currentPiece: { ...temp, position: state.currentPiece.position },
          })
        } else {
          set({
            heldPiece: { ...state.currentPiece, position: { x: 0, y: 0 } },
          })
          state.spawnPiece()
        }
        soundManager.playSound('hold')
      },

      checkCollision: (piece: Tetromino, dx = 0, dy = 0) => {
        const state = get()
        
        for (let y = 0; y < piece.shape.length; y++) {
          for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
              const newX = piece.position.x + x + dx
              const newY = piece.position.y + y + dy

              if (
                newX < 0 ||
                newX >= BOARD_WIDTH ||
                newY >= BOARD_HEIGHT ||
                (newY >= 0 && state.board[newY][newX])
              ) {
                return true
              }
            }
          }
        }
        return false
      },

      placePiece: () => {
        const state = get()
        if (!state.currentPiece) return

        const newBoard = state.board.map(row => [...row])
        
        // Place the piece on the board
        for (let y = 0; y < state.currentPiece.shape.length; y++) {
          for (let x = 0; x < state.currentPiece.shape[y].length; x++) {
            if (state.currentPiece.shape[y][x]) {
              const boardY = state.currentPiece.position.y + y
              const boardX = state.currentPiece.position.x + x
              
              if (boardY >= 0) {
                newBoard[boardY][boardX] = state.currentPiece.color
              }
            }
          }
        }

        set({ board: newBoard })
        state.clearLines()
        state.spawnPiece()
      },

      clearLines: () => {
        const state = get()
        let linesCleared = 0
        let linesToClear: number[] = []

        // Find lines to clear
        state.board.forEach((row, index) => {
          if (row.every(cell => cell !== null)) {
            linesToClear.push(index)
            linesCleared++
          }
        })

        if (linesCleared > 0) {
          const now = Date.now()
          const timeSinceLastClear = now - state.lastClearTime
          const newCombo = timeSinceLastClear < 3000 ? state.combo + 1 : 1

          // Set clearing animation state
          set({ 
            clearingLines: linesToClear,
            combo: newCombo,
            lastClearTime: now
          })

          // Check for perfect clear
          const isPerfectClear = state.board.every(row => 
            row.every(cell => cell === null || linesToClear.includes(state.board.indexOf(row)))
          );

          if (isPerfectClear) {
            const perfectClearBonus = 3000 * state.level;
            emitGameEvent('perfectClear', { score: perfectClearBonus });
            set(state => ({ score: state.score + perfectClearBonus }));
          }

          // Special effects for Tetris (4 lines)
          if (linesCleared === 4) {
            soundManager.playSound('tetris')
            const tetrisColor = state.currentPiece?.color || '#FFFFFF'
            emitGameEvent('tetrisClear', { color: tetrisColor })
          } else {
            soundManager.playSound('lineClear')
          }

          // Delay the actual line clearing to allow for animation
          setTimeout(() => {
            const newBoard = state.board.filter((_, index) => !linesToClear.includes(index))
            
            // Add empty rows at the top
            while (newBoard.length < BOARD_HEIGHT) {
              newBoard.unshift(Array(BOARD_WIDTH).fill(null))
            }

            set({ 
              board: newBoard,
              clearingLines: []
            })
            state.updateScore(linesCleared)
          }, 200) // Animation duration
        } else {
          set({ combo: 0 })
        }
      },

      updateScore: (linesCleared: number) => {
        const state = get()
        const baseScore = [0, 40, 100, 300, 1200][linesCleared]
        const comboBonus = state.combo > 1 ? state.combo * 50 : 0
        const newScore = state.score + (baseScore * state.level) + comboBonus
        const newLines = state.lines + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1

        // New speed calculation formula
        // Level 1: 1000ms (1 second)
        // Level 2: ~833ms
        // Level 5: ~500ms
        // Level 10: ~285ms
        // Level 15: ~200ms
        // Level 20: ~167ms
        const newDropInterval = Math.max(
          100, // Minimum interval (max speed)
          Math.floor(1000 * Math.pow(0.833, newLevel - 1))
        );

        // Emit score event
        if (baseScore > 0) {
          const lastClearedLine = state.clearingLines[state.clearingLines.length - 1];
          emitGameEvent('scorePoints', {
            score: baseScore * state.level + comboBonus,
            position: {
              x: Math.floor(BOARD_WIDTH / 2),
              y: lastClearedLine || 0
            }
          });
        }

        if (newLevel > state.level) {
          soundManager.playSound('levelUp')
          // Emit level up event
          emitGameEvent('levelUp', { level: newLevel });
        }

        set({
          score: newScore,
          lines: newLines,
          level: newLevel,
          dropInterval: newDropInterval,
        })
      },

      startGame: () => {
        const state = get()
        state.resetGame()
        
        // Generate initial 6 pieces (1 current + 5 next)
        const pieces = Array(6).fill(null).map(() => state.createPiece())
        const [firstPiece, ...nextPieces] = pieces

        set({ 
          gameStatus: 'playing',
          currentPiece: firstPiece,
          nextPieces: nextPieces,
        })
        soundManager.startMusic()
      },

      pauseGame: () => {
        set({ gameStatus: 'paused' })
        soundManager.pauseMusic()
      },

      endGame: () => {
        const state = get()
        state.resetGame()
        set({ gameStatus: 'menu' })
        soundManager.stopMusic()
        soundManager.playSound('gameOver')
      },

      resetGame: () => {
        set({
          board: createEmptyBoard(),
          currentPiece: null,
          nextPieces: [],
          heldPiece: null,
          score: 0,
          level: 1,
          lines: 0,
          combo: 0,
          lastClearTime: 0,
          clearingLines: [],
          dropInterval: 1000,
          gameStatus: 'menu'
        })
      },

      updateSettings: (newSettings: Partial<GameSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      addHighScore: (score: HighScore) => {
        set(state => ({
          highScores: [...state.highScores, score]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10),
        }))
      },

      toggleSound: () => {
        const isMuted = soundManager.toggleMute()
        set(state => ({
          settings: {
            ...state.settings,
            music: !isMuted,
            soundEffects: !isMuted,
          },
        }))
      },

      setVolume: (volume: number) => {
        soundManager.setVolume(volume)
        set(state => ({
          settings: {
            ...state.settings,
            volume,
          },
        }))
      },
    }),
    {
      name: 'tetris-storage',
      partialize: (state) => ({
        highScores: state.highScores,
        settings: state.settings,
      }),
    }
  )
) 