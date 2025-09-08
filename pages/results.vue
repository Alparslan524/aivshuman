<template>
    <div class="results-container">
        <div class="results-card">
            <h1 class="title">Oyun Bitti!</h1>
            <p class="subtitle">İşte sonuçların:</p>

            <div class="score-summary">
                <div class="success-rate">
                    <p>Başarı Oranı</p>
                    <span>%{{ gameStore.successRate }}</span>
                </div>
                <div class="score-details">
                    <div class="detail-item">
                        <p>Toplam Soru</p>
                        <span>{{ gameStore.totalQuestions }}</span>
                    </div>
                    <div class="detail-item">
                        <p>✔️ Doğru</p>
                        <span>{{ gameStore.score.correct }}</span>
                    </div>
                    <div class="detail-item">
                        <p>❌ Yanlış</p>
                        <span>{{ gameStore.score.incorrect }}</span>
                    </div>
                </div>
            </div>

            <div class="share-section">
                <p>Başarını Paylaş!</p>
                <div class="share-buttons">
                    <button @click="share('twitter')" class="share-btn twitter">Twitter</button>
                    <button @click="share('whatsapp')" class="share-btn whatsapp">WhatsApp</button>
                    <button @click="copyResults" class="share-btn copy">
                        {{ copied ? 'Kopyalandı!' : 'Kopyala' }}
                    </button>
                </div>
            </div>

            <div class="action-buttons">
                <button @click="playAgain" class="btn-play-again">Tekrar Oyna</button>
                <button @click="goHome" class="btn-home">Ana Sayfa</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGameStore } from '~/composables/store/game';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

const gameStore = useGameStore();
const router = useRouter();
const copied = ref(false);

const playAgain = () => {
    gameStore.startGame();
    router.push('/play');
};

const goHome = () => {
    gameStore.resetGame();
    router.push('/');
};

const shareText = computed(() => `AivsHuman oyununda ${gameStore.totalQuestions} soruda ${gameStore.score.correct} doğru cevap vererek %${gameStore.successRate} başarı oranı yakaladım! Sen de dene!`);
const gameUrl = 'https://aivshuman.com'; // Replace with your actual URL

const copyResults = () => {
    navigator.clipboard.writeText(shareText.value).then(() => {
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    });
};

const share = (platform) => {
    let url = '';
    const textToShare = shareText.value;
    if (platform === 'twitter') {
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(gameUrl)}`;
    } else if (platform === 'whatsapp') {
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare + ' ' + gameUrl)}`;
    }
    if (url) {
        window.open(url, '_blank');
    }
};

onMounted(() => {
    // If the game is not finished, redirect to home
    if (!gameStore.gameFinished) {
        router.push('/')
    }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.results-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(160deg, #8a71c9 0%, #5b4d8c 100%);
    padding: 20px;
}

.results-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(25px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 40px;
    width: 90%;
    max-width: 450px;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    color: #fff;
}

.title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 1.1rem;
    color: #e0e0e0;
    margin-bottom: 30px;
}

.score-summary {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 30px;
}

.success-rate {
    margin-bottom: 25px;
}

.success-rate p {
    font-size: 1rem;
    color: #dcdcdc;
    margin-bottom: 5px;
}

.success-rate span {
    font-size: 3.5rem;
    font-weight: 700;
    color: #2ecc71;
}

.score-details {
    display: flex;
    justify-content: space-around;
    text-align: center;
}

.detail-item p {
    font-size: 0.9rem;
    color: #dcdcdc;
    margin-bottom: 5px;
}

.detail-item span {
    font-size: 1.5rem;
    font-weight: 600;
}

.share-section {
    margin-bottom: 30px;
}

.share-section p {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 15px;
}

.share-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.share-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
}

.share-btn.twitter {
    background-color: #1DA1F2;
}

.share-btn.whatsapp {
    background-color: #25D366;
}

.share-btn.copy {
    background-color: #7f8c8d;
}

.share-btn:hover {
    opacity: 0.8;
}

.action-buttons {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.btn-play-again,
.btn-home {
    padding: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
}

.btn-play-again {
    background-color: #2979ff;
    color: white;
}

.btn-home {
    background-color: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn-play-again:hover {
    background-color: #0056b3;
}

.btn-home:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
