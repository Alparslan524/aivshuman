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
  // STATE
  const questions = ref(initialQuestions)
  const currentQuestionIndex = ref(0)
  const correctAnswers = ref(0)
  const incorrectAnswers = ref(0)
  const gameFinished = ref(false)
  const lastAnswerCorrect = ref<boolean | null>(null)
  const userAnswer = ref<'ai' | 'human' | null>(null)

  // GETTERS
  const totalQuestions = computed(() => questions.value.length)
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.value.length) * 100)
  const score = computed(() => ({
    correct: correctAnswers.value,
    incorrect: incorrectAnswers.value,
  }))
  const successRate = computed(() => {
    const totalAnswered = correctAnswers.value + incorrectAnswers.value
    if (totalAnswered === 0) return 0
    return Math.round((correctAnswers.value / totalAnswered) * 100)
  })
  const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

  // ACTIONS
  function resetGame() {
    currentQuestionIndex.value = 0
    correctAnswers.value = 0
    incorrectAnswers.value = 0
    gameFinished.value = false
    lastAnswerCorrect.value = null
    userAnswer.value = null
    // Optionally shuffle questions
    // questions.value.sort(() => Math.random() - 0.5)
  }

  function startGame() {
    resetGame()
  }

  function answerQuestion(answer: 'ai' | 'human') {
    if (gameFinished.value || userAnswer.value) return

    userAnswer.value = answer
    const question = currentQuestion.value
    if (!question) return

    if (question.type === answer) {
      correctAnswers.value++
      lastAnswerCorrect.value = true
    } else {
      incorrectAnswers.value++
      lastAnswerCorrect.value = false
    }
  }

  function nextQuestion() {
    if (isLastQuestion.value) {
      gameFinished.value = true
      // Yönlendirme mantığı buradan kaldırıldı
    } else {
      currentQuestionIndex.value++
      lastAnswerCorrect.value = null
      userAnswer.value = null
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
    // Getters
    totalQuestions,
    currentQuestion,
    progress,
    score,
    successRate,
    isLastQuestion,
    // Actions
    startGame,
    answerQuestion,
    nextQuestion,
    resetGame,
  }
})
