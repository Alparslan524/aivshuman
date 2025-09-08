<template>
    <div v-if="gameStore.currentQuestion" class="game-container">
        <div class="game-card">
            <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: gameStore.progress + '%' }"></div>
            </div>

            <div class="game-header">
                <p>Soru {{ gameStore.currentQuestionIndex + 1 }} / {{ gameStore.totalQuestions }}</p>
                <div class="score">
                    <span>✔️ {{ gameStore.score.correct }}</span>
                    <span>❌ {{ gameStore.score.incorrect }}</span>
                </div>
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
                </div>
                <div v-else class="feedback incorrect">
                    <p>😞 Yanlış! Doğru cevap: {{ gameStore.currentQuestion.type === 'human' ? 'İnsan Yapımı' :
                        'AI Yapımı' }}</p>
                </div>
                <button @click="gameStore.nextQuestion()" class="next-button">
                    {{ gameStore.isLastQuestion ? 'Sonuçları Gör' : 'Sonraki Soru' }} →
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGameStore } from '~/composables/store/game';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';

const gameStore = useGameStore();
const router = useRouter();

// Oyunun bitiş durumunu izle
watch(() => gameStore.gameFinished, (isFinished) => {
    if (isFinished) {
        router.push('/results');
    }
});

onMounted(() => {
    // If the game is finished, redirect to results
    if (gameStore.gameFinished) {
        router.push('/results');
        return;
    }

    // If the game hasn't been started (e.g., page refresh on /play),
    // reset and start from the beginning.
    if (gameStore.userAnswer !== null || gameStore.currentQuestionIndex > 0) {
        // This condition handles the case where a user refreshes the page mid-game.
        // We reset to avoid inconsistent state.
        gameStore.startGame();
    }
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
}

.feedback.incorrect {
    background-color: rgba(231, 76, 60, 0.8);
    color: white;
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
