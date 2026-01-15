// Global BGM controller shared by all pages
(function () {
    const STORAGE_KEY_TIME = 'maa_bgm_time';

    function initBgm() {
        const bgm = document.getElementById('bgm');
        if (!bgm) return;

        // Restore last playback time if available
        const savedTime = parseFloat(localStorage.getItem(STORAGE_KEY_TIME));
        if (!isNaN(savedTime) && isFinite(savedTime)) {
            try {
                bgm.currentTime = savedTime;
            } catch (e) {
                // ignore if cannot set currentTime yet
            }
        }

        bgm.loop = true;

        let isPlaying = false;
        bgm.addEventListener('play', function () { isPlaying = true; });
        bgm.addEventListener('pause', function () { isPlaying = false; });

        function tryPlay() {
            if (isPlaying) return;
            bgm.play().then(function () {
                // playing
            }).catch(function () {
                // Ignore play errors caused by browser policies
            });
        }

        // Try to play immediately on load
        tryPlay();

        // Retry on ANY user interaction while not playing
        ['click', 'wheel', 'keydown'].forEach(function (evt) {
            window.addEventListener(evt, function () {
                tryPlay();
            });
        });

        // Persist playback position regularly
        bgm.addEventListener('timeupdate', function () {
            try {
                localStorage.setItem(STORAGE_KEY_TIME, bgm.currentTime.toString());
            } catch (e) {
                // ignore quota or storage errors
            }
        });

        // Save once more on page unload
        window.addEventListener('beforeunload', function () {
            try {
                localStorage.setItem(STORAGE_KEY_TIME, bgm.currentTime.toString());
            } catch (e) { }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBgm);
    } else {
        initBgm();
    }
})();
