import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock data for questions. In a real app, this would come from an API.
const initialQuestions = [
  { id: 1, image: 'https://picsum.photos/seed/1/600/400', type: 'human', feature: 'Doğal bir dağ manzarası' },
  { id: 2, image: 'https://picsum.photos/seed/2/600/400', type: 'ai', feature: 'Sürreal bir portre' },
  { id: 3, image: 'https://picsum.photos/seed/3/600/400', type: 'human', feature: 'Kalabalık bir şehir sokağı' },
  { id: 4, image: 'https://picsum.photos/seed/4/600/400', type: 'ai', feature: 'Fantastik bir yaratık' },
  { id: 5, image: 'https://picsum.photos/seed/5/600/400', type: 'human', feature: 'Bir evcil hayvan fotoğrafı' },
  { id: 6, image: 'https://picsum.photos/seed/6/600/400', type: 'ai', feature: 'Uzayda bir astronot' },
  { id: 7, image: 'https://picsum.photos/seed/7/600/400', type: 'human', feature: 'Lezzetli bir yemek tabağı' },
  { id: 8, image: 'https://picsum.photos/seed/8/600/400', type: 'ai', feature: 'Su altında bir şehir' },
  { id: 9, image: 'https://picsum.photos/seed/9/600/400', type: 'human', feature: 'Tarihi bir yapı' },
  { id: 10, image: 'https://picsum.photos/seed/10/600/400', type: 'ai', feature: 'Robotların yaşadığı bir dünya' },
]

export const useGameStore = defineStore('gameStore', () => {
  // --- STATE ---
  const questions = ref([...initialQuestions].sort(() => Math.random() - 0.5))
  const currentQuestionIndex = ref(0)
  const correctAnswers = ref(0)
  const incorrectAnswers = ref(0)
  const gameFinished = ref(false)
  const lastAnswerCorrect = ref<boolean | null>(null)
  const userAnswer = ref<'ai' | 'human' | null>(null)

  // New state for game modes
  const gameMode = ref<'classic' | 'time' | null>(null)
  const timeAttackScore = ref(0) // Renamed from score
  const timeRemaining = ref(30)
  const questionStartTime = ref(0)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  // --- GETTERS ---
  const totalQuestions = computed(() => questions.value.length)
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const progress = computed(() => ((currentQuestionIndex.value) / 10) * 100) // Classic mode has 10 questions
  const score = computed(() => ({ // Re-introducing score object for classic mode consistency
    correct: correctAnswers.value,
    incorrect: incorrectAnswers.value,
  }))
  const successRate = computed(() => {
    const totalAnswered = correctAnswers.value + incorrectAnswers.value
    if (totalAnswered === 0) return 0
    return Math.round((correctAnswers.value / totalAnswered) * 100)
  })
  const isLastQuestion = computed(() => gameMode.value === 'classic' && currentQuestionIndex.value === 9)

  // --- ACTIONS ---
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function resetGame() {
    stopTimer()
    // Shuffle questions for a new game
    questions.value.sort(() => Math.random() - 0.5)
    currentQuestionIndex.value = 0
    correctAnswers.value = 0
    incorrectAnswers.value = 0
    gameFinished.value = false
    lastAnswerCorrect.value = null
    userAnswer.value = null
    gameMode.value = null
    timeAttackScore.value = 0 // Renamed from score
    timeRemaining.value = 30
  }

  function startGame(mode: 'classic' | 'time') {
    resetGame()
    gameMode.value = mode
    if (mode === 'time') {
      questionStartTime.value = Date.now()
      timerInterval = setInterval(() => {
        timeRemaining.value--
        if (timeRemaining.value <= 0) {
          stopTimer()
          gameFinished.value = true
        }
      }, 1000)
    }
  }

  function answerQuestion(answer: 'ai' | 'human') {
    if (gameFinished.value || userAnswer.value) return

    userAnswer.value = answer
    const question = currentQuestion.value
    if (!question) return // Should not happen, but as a safeguard

    const isCorrect = question.type === answer

    if (isCorrect) {
      lastAnswerCorrect.value = true
      correctAnswers.value++
      if (gameMode.value === 'time') {
        const timeTaken = (Date.now() - questionStartTime.value) / 1000 // in seconds
        const points = Math.max(10, 100 - Math.floor(timeTaken * 5)) // Faster answers get more points
        timeAttackScore.value += points // Use the new state variable
      }
    } else {
      lastAnswerCorrect.value = false
      incorrectAnswers.value++
    }
  }

  function nextQuestion() {
    if (gameFinished.value) return

    if (gameMode.value === 'classic' && isLastQuestion.value) {
      gameFinished.value = true
      return
    }

    // Move to the next question, looping if necessary for time mode
    currentQuestionIndex.value = (currentQuestionIndex.value + 1) % questions.value.length
    lastAnswerCorrect.value = null
    userAnswer.value = null

    if (gameMode.value === 'time') {
      questionStartTime.value = Date.now()
    }
  }

  return {
    // State
    questions,
    currentQuestionIndex,
    correctAnswers,
    incorrectAnswers,
    gameFinished,
    lastAnswerCorrect,
    userAnswer,
    gameMode,
    timeAttackScore, // Renamed
    timeRemaining,
    // Getters
    totalQuestions,
    currentQuestion,
    progress,
    score, // Keep for classic mode compatibility
    successRate,
    isLastQuestion,
    // Actions
    startGame,
    answerQuestion,
    nextQuestion,
    resetGame,
  }
})
