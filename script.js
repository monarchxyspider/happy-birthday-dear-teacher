/* =========================================================
   HAPPY BIRTHDAY TEACHER
   ABC / CLASSROOM THEME
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const intro = document.getElementById("intro");
const birthdayExperience = document.getElementById("birthdayExperience");

const birthdayMusic = document.getElementById("birthdayMusic");

const floatingMessages =
    document.getElementById("floatingMessages");

const bigBirthdayText =
    document.getElementById("bigBirthdayText");

const birthdayMessage =
    document.getElementById("birthdayMessage");

const messageCard =
    document.getElementById("messageCard");

const wishButton =
    document.getElementById("wishButton");

const candleHint =
    document.getElementById("candleHint");

const cake =
    document.getElementById("cake");


/* =========================================================
   SETTINGS
   ========================================================= */

let started = false;
let candlesBlown = 0;
let birthdayShown = false;

const totalCandles = 5;


/* =========================================================
   START EXPERIENCE
   ========================================================= */

function startBirthday() {

    if (started) return;

    started = true;

    /* Hide intro */

    if (intro) {
        intro.classList.add("intro-hidden");
    }


    /* Show birthday experience */

    if (birthdayExperience) {
        birthdayExperience.classList.add("experience-visible");
    }


    /* Start music */

    playBirthdayMusic();


    /* Start floating messages */

    startFloatingMessages();


    /* Start cake animation */

    startCakeAnimation();

}


/* =========================================================
   INTRO CLICK
   ========================================================= */

if (intro) {

    intro.addEventListener("click", startBirthday);

}


/* =========================================================
   MUSIC
   ========================================================= */

function playBirthdayMusic() {

    if (!birthdayMusic) return;

    birthdayMusic.volume = 0.45;

    const promise = birthdayMusic.play();

    if (promise !== undefined) {

        promise.catch(() => {

            /*
             Browser autoplay protection.

             Music will start after the user's next
             interaction if autoplay is blocked.
            */

            document.addEventListener(
                "click",
                () => {

                    birthdayMusic.play().catch(() => {});

                },
                { once: true }
            );

        });

    }

}


/* =========================================================
   CAKE LAYER-BY-LAYER ANIMATION
   ========================================================= */

function startCakeAnimation() {

    if (!cake) return;

    const cakeParts =
        cake.querySelectorAll(".cake-part");

    const cakePlate =
        cake.querySelector(".cake-plate");

    const cakeIntro =
        document.getElementById("cakeIntro");


    /* Cake starts hidden */

    cakeParts.forEach(part => {

        part.classList.add("cake-hidden");

    });


    if (cakePlate) {

        cakePlate.classList.add("cake-hidden");

    }


    /*
     * Small delay before building cake
     */

    setTimeout(() => {

        if (cakeIntro) {

            cakeIntro.classList.add("cake-intro-fade");

        }

    }, 600);


    /*
     * Bottom layer
     */

    setTimeout(() => {

        showCakePart(".cake-bottom-layer");

    }, 1200);


    /*
     * Middle cream
     */

    setTimeout(() => {

        showCakePart(".cake-cream-layer");

    }, 2000);


    /*
     * Chocolate middle
     */

    setTimeout(() => {

        showCakePart(".cake-chocolate-layer");

    }, 2800);


    /*
     * Top cream
     */

    setTimeout(() => {

        showCakePart(".cake-top-layer");

    }, 3600);


    /*
     * Top chocolate
     */

    setTimeout(() => {

        showCakePart(".cake-top");

    }, 4400);


    /*
     * Plate

     */

    setTimeout(() => {

        if (cakePlate) {

            cakePlate.classList.remove("cake-hidden");
            cakePlate.classList.add("cake-built");

        }

    }, 5000);


    /*
     * Candles appear after cake
     */

    setTimeout(() => {

        const candles =
            document.querySelector(".candles");

        if (candles) {

            candles.classList.add("candles-visible");

        }

        startCandles();

    }, 5500);

}


/* =========================================================
   SHOW CAKE PART
   ========================================================= */

function showCakePart(selector) {

    const part =
        document.querySelector(selector);

    if (!part) return;

    part.classList.remove("cake-hidden");

    part.classList.add("cake-built");

}


/* =========================================================
   CANDLES
   ========================================================= */

function startCandles() {

    const candles =
        document.querySelectorAll(".candle");

    candles.forEach((candle, index) => {

        /*
         * Give each candle a tiny delay
         */

        setTimeout(() => {

            candle.classList.add("candle-lit");

        }, index * 120);

    });

}


/* =========================================================
   BLOW CANDLE
   ========================================================= */

function blowCandle(candle) {

    if (!candle) return;

    /*
     * Prevent clicking same candle twice
     */

    if (candle.classList.contains("blown")) {
        return;
    }


    candle.classList.add("blown");

    candlesBlown++;


    /*
     * Flame disappears
     */

    const flame =
        candle.querySelector(".flame");

    if (flame) {

        flame.classList.add("flame-out");

    }


    /*
     * Smoke appears
     */

    const smoke =
        candle.querySelector(".smoke");

    if (smoke) {

        smoke.classList.add("smoke-active");

    }


    /*
     * Tiny candle bounce
     */

    candle.classList.add("candle-blown");


    /*
     * Update hint
     */

    if (candleHint) {

        if (candlesBlown < totalCandles) {

            const remaining =
                totalCandles - candlesBlown;

            candleHint.textContent =
                `✨ ${remaining} candle${remaining === 1 ? "" : "s"} left ✨`;

        }

    }


    /*
     * When every candle is blown
     */

    if (candlesBlown >= totalCandles) {

        allCandlesBlown();

    }

}


/* =========================================================
   ALL CANDLES BLOWN
   ========================================================= */

function allCandlesBlown() {

    if (birthdayShown) return;

    birthdayShown = true;


    if (candleHint) {

        candleHint.classList.add("hint-complete");

        candleHint.textContent =
            "✨ Wish made! Happy Birthday! ✨";

    }


    /*
     * Cake glow becomes stronger
     */

    const cakeGlow =
        document.querySelector(".cake-glow");

    if (cakeGlow) {

        cakeGlow.classList.add("celebration-glow");

    }


    /*
     * Start birthday message
     */

    setTimeout(() => {

        showBirthdayText();

    }, 1200);


    /*
     * Extra floating messages

     */

    setTimeout(() => {

        createFloatingMessage(
            "Happy Birthday! 🎂",
            true
        );

    }, 500);

}


/* =========================================================
   LETTER-BY-LETTER HAPPY BIRTHDAY
   ========================================================= */

function showBirthdayText() {

    if (!bigBirthdayText) return;

    const text =
        "HAPPY BIRTHDAY";

    bigBirthdayText.innerHTML = "";

    birthdayMessage.classList.add(
        "birthday-message-visible"
    );


    let index = 0;


    function typeLetter() {

        if (index >= text.length) {

            showMessageCard();

            return;

        }


        const character = text[index];


        const span =
            document.createElement("span");

        span.className =
            "birthday-letter";


        if (character === " ") {

            span.innerHTML = "&nbsp;";

        } else {

            span.textContent = character;

        }


        bigBirthdayText.appendChild(span);


        /*
         * Small random entrance effect
         */

        setTimeout(() => {

            span.classList.add(
                "birthday-letter-visible"
            );

        }, 30);


        index++;


        setTimeout(
            typeLetter,
            character === " " ? 180 : 120
        );

    }


    typeLetter();

}


/* =========================================================
   MESSAGE CARD
   ========================================================= */

function showMessageCard() {

    if (!messageCard) return;

    setTimeout(() => {

        messageCard.classList.add(
            "message-card-visible"
        );

    }, 500);


    /*
     * Start bigger floating birthday messages
     */

    setTimeout(() => {

        createFloatingMessage(
            "Thank You, Teacher! 📚❤️",
            true
        );

    }, 1000);

}


/* =========================================================
   RANDOM FLOATING MESSAGES
   ========================================================= */

const floatingTextList = [

    "Happy Birthday! 🎂",

    "Best Teacher Ever! 📚",

    "Thank You, Teacher! ❤️",

    "Keep Inspiring! ✨",

    "A • B • C 🎓",

    "You Are Amazing! ⭐",

    "Best Wishes! 💖",

    "Have a Beautiful Day! 🌸",

    "Keep Smiling! 😊",

    "Thank You For Everything! 📖",

    "You're Brilliant! ✏️",

    "Many Many Happy Returns! 🎉"

];


function startFloatingMessages() {

    /*
     * First message
     */

    setTimeout(() => {

        createFloatingMessage();

    }, 2500);


    /*
     * Continue randomly
     */

    setInterval(() => {

        if (!started) return;

        createFloatingMessage();

    }, 3000);

}


/* =========================================================
   CREATE FLOATING MESSAGE
   ========================================================= */

function createFloatingMessage(text = null, special = false) {

    if (!floatingMessages) return;


    const message =
        document.createElement("div");

    message.className =
        special
            ? "floating-message floating-special"
            : "floating-message";


    message.textContent =
        text ||
        floatingTextList[
            Math.floor(
                Math.random() *
                floatingTextList.length
            )
        ];


    /*
     * Random screen position
     */

    const left =
        Math.random() * 82 + 5;

    const top =
        Math.random() * 72 + 8;


    message.style.left =
        `${left}%`;

    message.style.top =
        `${top}%`;


    /*
     * Random rotation
     */

    const rotation =
        Math.random() * 12 - 6;

    message.style.setProperty(
        "--random-rotation",
        `${rotation}deg`
    );


    /*
     * Random animation delay
     */

    message.style.animationDelay =
        `${Math.random() * 0.5}s`;


    floatingMessages.appendChild(message);


    /*
     * Remove later
     */

    setTimeout(() => {

        message.classList.add(
            "floating-message-hide"
        );

    }, special ? 5000 : 3500);


    setTimeout(() => {

        message.remove();

    }, special ? 6500 : 5000);

}


/* =========================================================
   MAKE A WISH BUTTON
   ========================================================= */

if (wishButton) {

    wishButton.addEventListener(
        "click",
        makeWish
    );

}


function makeWish() {

    /*
     * Button animation
     */

    wishButton.classList.add(
        "wish-button-clicked"
    );


    setTimeout(() => {

        wishButton.classList.remove(
            "wish-button-clicked"
        );

    }, 700);


    /*
     * Create lots of little wishes
     */

    const wishes = [

        "May you always smile! ❤️",

        "May Allah bless you! 🤲",

        "Keep inspiring! 📚",

        "Stay happy! ✨",

        "Best wishes, Teacher! 🎂"

    ];


    wishes.forEach((wish, index) => {

        setTimeout(() => {

            createFloatingMessage(
                wish,
                true
            );

        }, index * 350);

    });


    /*
     * Confetti effect

     */

    createConfetti();


    /*
     * Play music again if paused
     */

    if (
        birthdayMusic &&
        birthdayMusic.paused
    ) {

        birthdayMusic.play().catch(() => {});

    }

}


/* =========================================================
   SIMPLE CONFETTI
   ========================================================= */

function createConfetti() {

    const symbols = [

        "✦",
        "★",
        "♥",
        "✧",
        "•",
        "🎉",
        "✨"

    ];


    for (let i = 0; i < 35; i++) {

        const piece =
            document.createElement("span");

        piece.className =
            "generated-confetti";


        piece.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        piece.style.left =
            `${Math.random() * 100}%`;

        piece.style.animationDelay =
            `${Math.random() * 0.8}s`;

        piece.style.animationDuration =
            `${2 + Math.random() * 2}s`;


        document.body.appendChild(piece);


        setTimeout(() => {

            piece.remove();

        }, 4500);

    }

}


/* =========================================================
   FLOATING ABC LETTERS
   ========================================================= */

function createABCFloat() {

    const letters = [
        "A",
        "B",
        "C",
        "📚",
        "✏️",
        "⭐"
    ];


    const item =
        document.createElement("div");

    item.className =
        "generated-abc";


    item.textContent =
        letters[
            Math.floor(
                Math.random() *
                letters.length
            )
        ];


    item.style.left =
        `${Math.random() * 95}%`;

    item.style.animationDuration =
        `${5 + Math.random() * 5}s`;


    document.body.appendChild(item);


    setTimeout(() => {

        item.remove();

    }, 10000);

}


/* =========================================================
   ABC BACKGROUND LOOP
   ========================================================= */

setInterval(() => {

    if (started) {

        createABCFloat();

    }

}, 4500);


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Enter / Space starts experience
         */

        if (
            !started &&
            (
                event.key === "Enter" ||
                event.key === " "
            )
        ) {

            event.preventDefault();

            startBirthday();

        }

    }
);


/* =========================================================
   PREVENT IMAGE DRAGGING
   ========================================================= */

document.querySelectorAll("img").forEach(img => {

    img.addEventListener(
        "dragstart",
        event => {

            event.preventDefault();

        }
    );

});


/* =========================================================
   INITIAL STATE
   ========================================================= */

if (birthdayExperience) {

    birthdayExperience.classList.remove(
        "experience-visible"
    );

}


if (birthdayMessage) {

    birthdayMessage.classList.remove(
        "birthday-message-visible"
    );


}


if (messageCard) {

    messageCard.classList.remove(
        "message-card-visible"
    );

}


/* =========================================================
   DONE
   ========================================================= */

console.log(
    "🎓 Happy Birthday Teacher website loaded successfully! ❤️"
);