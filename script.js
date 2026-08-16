/* =========================================================
   HAPPY BIRTHDAY TEACHER
   FINAL WORKING SCRIPT
   ========================================================= */

const intro = document.getElementById("intro");
const birthdayExperience =
    document.getElementById("birthdayExperience");

const birthdayMusic =
    document.getElementById("birthdayMusic");

const cake =
    document.getElementById("cake");

const cakeIntro =
    document.getElementById("cakeIntro");

const candles =
    document.getElementById("candles");

const candleHint =
    document.getElementById("candleHint");

const birthdayMessage =
    document.getElementById("birthdayMessage");

const bigBirthdayText =
    document.getElementById("bigBirthdayText");

const messageCard =
    document.getElementById("messageCard");

const wishButton =
    document.getElementById("wishButton");

const floatingMessages =
    document.getElementById("floatingMessages");


/* =========================================================
   VARIABLES
   ========================================================= */

let started = false;
let blownCandles = 0;
let birthdayFinished = false;

const totalCandles = 5;


/* =========================================================
   INITIAL STATE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
     * Experience hidden at first
     */

    if (birthdayExperience) {
        birthdayExperience.classList.remove(
            "experience-visible"
        );
    }


    /*
     * Birthday message hidden
     */

    if (birthdayMessage) {
        birthdayMessage.classList.remove(
            "birthday-message-visible"
        );
    }


    /*
     * Message card hidden
     */

    if (messageCard) {
        messageCard.classList.remove(
            "message-card-visible"
        );
    }


    /*
     * Hide every cake layer initially
     */

    if (cake) {

        const parts =
            cake.querySelectorAll(".cake-part");

        parts.forEach(part => {

            part.classList.add("cake-hidden");

        });


        const plate =
            cake.querySelector(".cake-plate");

        if (plate) {

            plate.classList.add("cake-hidden");

        }

    }


    /*
     * Hide candles initially
     */

    if (candles) {

        candles.classList.remove(
            "candles-visible"
        );

    }

});


/* =========================================================
   START WEBSITE
   ========================================================= */

function startBirthday() {

    if (started) return;

    started = true;


    /* -----------------------------------------
       Hide intro
    ----------------------------------------- */

    if (intro) {

        intro.classList.add(
            "intro-hidden"
        );

    }


    /* -----------------------------------------
       Show experience
    ----------------------------------------- */

    if (birthdayExperience) {

        birthdayExperience.classList.add(
            "experience-visible"
        );

    }


    /* -----------------------------------------
       Music
    ----------------------------------------- */

    if (birthdayMusic) {

        birthdayMusic.volume = 0.45;

        birthdayMusic.play().catch(() => {
            console.log(
                "Music waiting for browser permission."
            );
        });

    }


    /* -----------------------------------------
       Cake
    ----------------------------------------- */

    startCake();


    /* -----------------------------------------
       Floating messages
    ----------------------------------------- */

    setTimeout(() => {

        createFloatingMessage(
            "Happy Birthday Teacher! 🎂"
        );

    }, 1500);

}


/* =========================================================
   TAP ANYWHERE TO START
   ========================================================= */

if (intro) {

    intro.addEventListener(
        "click",
        startBirthday
    );

}


/*
 * Extra safety:
 * if user taps the intro content itself
 */

const introContent =
    document.querySelector(".intro-content");

if (introContent) {

    introContent.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            startBirthday();

        }
    );

}


/* =========================================================
   CAKE BUILDING
   ========================================================= */

function startCake() {

    if (!cake) return;


    const bottom =
        cake.querySelector(
            ".cake-bottom-layer"
        );

    const cream =
        cake.querySelector(
            ".cake-cream-layer"
        );

    const chocolate =
        cake.querySelector(
            ".cake-chocolate-layer"
        );

    const topCream =
        cake.querySelector(
            ".cake-top-layer"
        );

    const top =
        cake.querySelector(
            ".cake-top"
        );

    const plate =
        cake.querySelector(
            ".cake-plate"
        );


    /* -----------------------------------------
       Hide all parts
    ----------------------------------------- */

    [
        bottom,
        cream,
        chocolate,
        topCream,
        top,
        plate
    ].forEach(part => {

        if (part) {

            part.classList.add(
                "cake-hidden"
            );

        }

    });


    /* -----------------------------------------
       Bottom sponge
    ----------------------------------------- */

    setTimeout(() => {

        revealCake(bottom);

    }, 700);


    /* -----------------------------------------
       Cream
    ----------------------------------------- */

    setTimeout(() => {

        revealCake(cream);

    }, 1500);


    /* -----------------------------------------
       Chocolate
    ----------------------------------------- */

    setTimeout(() => {

        revealCake(chocolate);

    }, 2300);


    /* -----------------------------------------
       Top cream
    ----------------------------------------- */

    setTimeout(() => {

        revealCake(topCream);

    }, 3100);


    /* -----------------------------------------
       Top chocolate
    ----------------------------------------- */

    setTimeout(() => {

        revealCake(top);

    }, 3900);


    /* -----------------------------------------
       Plate
    ----------------------------------------- */

    setTimeout(() => {

        revealCake(plate);

    }, 4600);


    /* -----------------------------------------
       Cake intro disappears
    ----------------------------------------- */

    setTimeout(() => {

        if (cakeIntro) {

            cakeIntro.classList.add(
                "cake-intro-fade"
            );

        }

    }, 4200);


    /* -----------------------------------------
       Candles
    ----------------------------------------- */

    setTimeout(() => {

        showCandles();

    }, 5000);

}


/* =========================================================
   REVEAL CAKE PART
   ========================================================= */

function revealCake(element) {

    if (!element) return;

    element.classList.remove(
        "cake-hidden"
    );

    element.classList.add(
        "cake-built"
    );

}


/* =========================================================
   SHOW CANDLES
   ========================================================= */

function showCandles() {

    if (!candles) return;

    candles.classList.add(
        "candles-visible"
    );


    const allCandles =
        document.querySelectorAll(
            ".candle"
        );


    allCandles.forEach(
        (candle, index) => {

            setTimeout(() => {

                candle.classList.add(
                    "candle-lit"
                );

            }, index * 150);

        }
    );


    if (candleHint) {

        candleHint.textContent =
            "✨ Click the candles and make a wish ✨";

    }

}


/* =========================================================
   BLOW CANDLE
   ========================================================= */

function blowCandle(candle) {

    if (!candle) return;


    if (
        candle.classList.contains(
            "blown"
        )
    ) {

        return;

    }


    candle.classList.add(
        "blown"
    );


    blownCandles++;


    /* -----------------------------------------
       Flame
    ----------------------------------------- */

    const flame =
        candle.querySelector(
            ".flame"
        );

    if (flame) {

        flame.classList.add(
            "flame-out"
        );

    }


    /* -----------------------------------------
       Smoke
    ----------------------------------------- */

    const smoke =
        candle.querySelector(
            ".smoke"
        );

    if (smoke) {

        smoke.classList.add(
            "smoke-active"
        );

    }


    /* -----------------------------------------
       Candle animation
    ----------------------------------------- */

    candle.classList.add(
        "candle-blown"
    );


    /* -----------------------------------------
       Remaining candles
    ----------------------------------------- */

    const remaining =
        totalCandles - blownCandles;


    if (
        candleHint &&
        remaining > 0
    ) {

        candleHint.textContent =
            `✨ ${remaining} candle${remaining > 1 ? "s" : ""} left ✨`;

    }


    /* -----------------------------------------
       ALL CANDLES BLOWN
    ----------------------------------------- */

    if (
        blownCandles >= totalCandles &&
        !birthdayFinished
    ) {

        birthdayFinished = true;

        allCandlesBlown();

    }

}


/* =========================================================
   ALL CANDLES BLOWN
   ========================================================= */

function allCandlesBlown() {

    if (candleHint) {

        candleHint.textContent =
            "🎉 Wish made! Happy Birthday! 🎉";

        candleHint.classList.add(
            "hint-complete"
        );

    }


    /* Cake celebration */

    if (cake) {

        cake.classList.add(
            "cake-celebration"
        );

    }


    /* Confetti */

    createConfetti();


    /* Floating message */

    createFloatingMessage(
        "Happy Birthday Teacher! 🎂❤️",
        true
    );


    /*
     * Wait before showing big text
     */

    setTimeout(() => {

        showHappyBirthday();

    }, 1200);

}


/* =========================================================
   HAPPY BIRTHDAY LETTER BY LETTER
   ========================================================= */

function showHappyBirthday() {

    if (!birthdayMessage) return;

    birthdayMessage.classList.add(
        "birthday-message-visible"
    );


    if (!bigBirthdayText) return;


    bigBirthdayText.innerHTML = "";


    const text =
        "HAPPY BIRTHDAY";


    let index = 0;


    function typeNextLetter() {

        if (index >= text.length) {

            setTimeout(() => {

                showMessageCard();

            }, 600);

            return;

        }


        const letter =
            document.createElement(
                "span"
            );


        letter.className =
            "birthday-letter";


        if (text[index] === " ") {

            letter.innerHTML =
                "&nbsp;";

        } else {

            letter.textContent =
                text[index];

        }


        bigBirthdayText.appendChild(
            letter
        );


        setTimeout(() => {

            letter.classList.add(
                "birthday-letter-visible"
            );

        }, 30);


        index++;


        setTimeout(
            typeNextLetter,
            130
        );

    }


    typeNextLetter();

}


/* =========================================================
   MESSAGE CARD
   ========================================================= */

function showMessageCard() {

    if (!messageCard) return;


    messageCard.classList.add(
        "message-card-visible"
    );


    setTimeout(() => {

        createFloatingMessage(
            "Thank You, Teacher! 📚❤️",
            true
        );

    }, 800);

}


/* =========================================================
   FLOATING MESSAGES
   ========================================================= */

const messages = [

    "Happy Birthday! 🎂",

    "Best Teacher Ever! 📚",

    "Thank You Teacher! ❤️",

    "You Are Amazing! ⭐",

    "Keep Inspiring! ✨",

    "A • B • C 🎓",

    "Best Wishes! 💖",

    "Have A Beautiful Day! 🌸",

    "Keep Smiling! 😊",

    "You're Brilliant! ✏️"

];


function createFloatingMessage(
    customText = null,
    special = false
) {

    if (!floatingMessages) return;


    const message =
        document.createElement(
            "div"
        );


    message.className =
        special
            ? "floating-message floating-special"
            : "floating-message";


    message.textContent =
        customText ||
        messages[
            Math.floor(
                Math.random() *
                messages.length
            )
        ];


    /*
     * Random position
     */

    message.style.left =
        `${Math.random() * 80 + 5}%`;

    message.style.top =
        `${Math.random() * 70 + 5}%`;


    /*
     * Random rotation
     */

    message.style.setProperty(
        "--random-rotation",
        `${Math.random() * 10 - 5}deg`
    );


    floatingMessages.appendChild(
        message
    );


    setTimeout(() => {

        message.classList.add(
            "floating-message-hide"
        );

    }, special ? 4500 : 3000);


    setTimeout(() => {

        message.remove();

    }, special ? 6000 : 4500);

}


/* =========================================================
   CONTINUOUS FLOATING MESSAGES
   ========================================================= */

setInterval(() => {

    if (started) {

        createFloatingMessage();

    }

}, 3500);


/* =========================================================
   MAKE A WISH
   ========================================================= */

if (wishButton) {

    wishButton.addEventListener(
        "click",
        makeWish
    );

}


function makeWish() {

    if (!wishButton) return;


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
     * Wish messages
     */

    const wishes = [

        "May Allah bless you 🤲",

        "May you always stay happy ❤️",

        "May your life be full of peace ✨",

        "Keep inspiring everyone 📚",

        "Many happy returns! 🎂"

    ];


    wishes.forEach(
        (wish, index) => {

            setTimeout(() => {

                createFloatingMessage(
                    wish,
                    true
                );

            }, index * 450);

        }
    );


    /*
     * Confetti
     */

    createConfetti();


    /*
     * Music
     */

    if (
        birthdayMusic &&
        birthdayMusic.paused
    ) {

        birthdayMusic.play().catch(
            () => {}
        );

    }

}


/* =========================================================
   CONFETTI
   ========================================================= */

function createConfetti() {

    const symbols = [
        "🎉",
        "✨",
        "⭐",
        "♥",
        "✦",
        "🎊",
        "📚",
        "✏️"
    ];


    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );


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


        document.body.appendChild(
            piece
        );


        setTimeout(() => {

            piece.remove();

        }, 4500);

    }

}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

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
   IMAGE DRAG PREVENTION
   ========================================================= */

document.querySelectorAll(
    "img"
).forEach(img => {

    img.addEventListener(
        "dragstart",
        event => {

            event.preventDefault();

        }
    );

});


/* =========================================================
   MAKE BLOW CANDLE GLOBAL
   IMPORTANT FOR onclick="blowCandle(this)"
   ========================================================= */

window.blowCandle =
    blowCandle;


/* =========================================================
   DONE
   ========================================================= */

console.log(
    "🎓 Teacher Birthday Website Ready ❤️"
);