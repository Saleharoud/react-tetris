export interface Position {
  x: number
  y: number
}

export interface TetrominoShape {
  shape: number[][]
  color: string
}

export interface Tetromino extends TetrominoShape {
  position: Position
  rotation: number
}

export interface GameState {
  board: (string | null)[][]
  currentPiece: Tetromino | null
  nextPieces: Tetromino[]
  heldPiece: Tetromino | null
  score: number
  level: number
  lines: number
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver'
  dropTime: number
  dropInterval: number
}

export interface GameSettings {
  music: boolean
  soundEffects: boolean
  volume: number
  controls: {
    moveLeft: string
    moveRight: string
    softDrop: string
    hardDrop: string
    rotate: string
    hold: string
    pause: string
  }
  theme: 'luxury' | 'classic' | 'neon'
}

export interface HighScore {
  name: string
  score: number
  level: number
  lines: number
  date: string
}

export const TETROMINO_SHAPES: { [key: string]: TetrominoShape } = {
  I: { shape: [[1, 1, 1, 1]], color: '#64ffda' },
  O: { shape: [[1, 1], [1, 1]], color: '#ffd93d' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#ff6b9d' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00e676' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff5722' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#2196f3' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9800' },
}

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20
export const BLOCK_SIZE = 30 