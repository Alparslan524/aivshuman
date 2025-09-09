<template>
    <div v-if="gameStore.currentQuestion" class="game-container">
        <div class="game-card">
            <!-- Classic Mode: Progress Bar -->
            <div v-if="gameStore.gameMode === 'classic'" class="progress-bar-container">
                <div class="progress-bar" :style="{ width: gameStore.progress + '%' }"></div>
            </div>

            <!-- Time Attack Mode: Timer Bar -->
            <div v-if="gameStore.gameMode === 'time'" class="progress-bar-container">
                <div class="timer-bar" :style="{ width: (gameStore.timeRemaining / 30) * 100 + '%' }"></div>
            </div>

            <div class="game-header">
                <!-- Classic Mode Header -->
                <template v-if="gameStore.gameMode === 'classic'">
                    <p>Soru {{ gameStore.currentQuestionIndex + 1 }} / 10</p>
                    <div class="score">
                        <span>✔️ {{ gameStore.correctAnswers }}</span>
                        <span>❌ {{ gameStore.incorrectAnswers }}</span>
                    </div>
                </template>

                <!-- Time Attack Mode Header -->
                <template v-if="gameStore.gameMode === 'time'">
                    <p>⏱️ {{ gameStore.timeRemaining }}s</p>
                    <div class="score">
                        <span>🏆 {{ gameStore.timeAttackScore }} Puan</span>
                    </div>
                </template>
            </div>

            <div class="question-content">
                <img :src="gameStore.currentQuestion.image" alt="Soru görseli" class="question-image">
                <p class="feature-text">{{ gameStore.currentQuestion.feature }}</p>
            </div>

            <div v-if="!gameStore.userAnswer" class="answer-buttons">
                <button @click="gameStore.answerQuestion('human')">👨‍🎨 İnsan Yapımı</button>
                <button @click="gameStore.answerQuestion('ai')">🤖 AI Yapımı</button>
            </div>

            <div v-if="gameStore.userAnswer" class="feedback-container">
                <div v-if="gameStore.lastAnswerCorrect" class="feedback correct">
                    <p>🎉 Doğru!</p>
                    <p v-if="gameStore.gameMode === 'time'" class="points-earned">+{{ lastPoints }} puan</p>
                </div>
                <div v-else class="feedback incorrect">
                    <p>😞 Yanlış! Doğru cevap: {{ gameStore.currentQuestion.type === 'human' ? 'İnsan Yapımı' :
                        'AI Yapımı' }}</p>
                </div>
                <button @click="handleNextQuestion" class="next-button">
                    {{ gameStore.isLastQuestion ? 'Sonuçları Gör' : 'Sonraki Soru' }} →
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGameStore } from '~/composables/store/game';
import { useRouter } from 'vue-router';
import { onMounted, watch, ref } from 'vue';

const gameStore = useGameStore();
const router = useRouter();
const lastPoints = ref(0);
const previousScore = ref(0);

// Watch for the game to finish and redirect
watch(() => gameStore.gameFinished, (isFinished) => {
    if (isFinished) {
        router.push('/results');
    }
});

// Watch for score changes to show points earned
watch(() => gameStore.timeAttackScore, (newScore) => {
    if (gameStore.gameMode === 'time' && newScore > previousScore.value) {
        lastPoints.value = newScore - previousScore.value;
        previousScore.value = newScore;
    }
});

const handleNextQuestion = () => {
    gameStore.nextQuestion();
    previousScore.value = gameStore.timeAttackScore; // Reset for next question
}

onMounted(() => {
    // If no mode is selected (e.g., direct navigation or refresh), go home.
    if (!gameStore.gameMode) {
        router.push('/');
        return;
    }
    // If the game is already finished, go to results.
    if (gameStore.gameFinished) {
        router.push('/results');
    }
    previousScore.value = gameStore.timeAttackScore;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(160deg, #8a71c9 0%, #5b4d8c 100%);
    padding: 20px;
}

.game-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(25px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 30px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    color: #fff;
}

.progress-bar-container {
    width: 100%;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #2ecc71;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.timer-bar {
    height: 100%;
    background-color: #f39c12;
    border-radius: 4px;
    transition: width 0.5s linear;
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: #e0e0e0;
}

.score span {
    margin-left: 15px;
}

.question-content {
    margin-bottom: 30px;
}

.question-image {
    width: 100%;
    height: auto;
    border-radius: 16px;
    margin-bottom: 15px;
    object-fit: cover;
    aspect-ratio: 16 / 9;
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.feature-text {
    font-size: 1.1rem;
    font-weight: 600;
}

.answer-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.answer-buttons button {
    padding: 15px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
}

.answer-buttons button:first-child {
    background-color: #3498db;
    color: white;
}

.answer-buttons button:last-child {
    background-color: #9b59b6;
    color: white;
}

.answer-buttons button:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.feedback-container {
    margin-top: 20px;
}

.feedback {
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 1.1rem;
    font-weight: 600;
}

.feedback.correct {
    background-color: rgba(46, 204, 113, 0.8);
    color: white;
    padding: 10px;
}

.feedback.incorrect {
    background-color: rgba(231, 76, 60, 0.8);
    color: white;
}

.points-earned {
    font-size: 0.9rem;
    font-weight: 400;
    margin-top: 5px;
}

.next-button {
    width: 100%;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    background-color: #2979ff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'Poppins', sans-serif;
}

.next-button:hover {
    background-color: #0056b3;
}
</style>
