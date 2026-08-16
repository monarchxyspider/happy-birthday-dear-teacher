/* =========================================================
   TEACHER BIRTHDAY WEBSITE
   MEDIA CONFIGURATION
   =========================================================

   Yahan sirf apne custom image / GIF links paste karo.

   Example:

   book: "https://example.com/book.gif"

   Agar kisi item ko use nahi karna ho:
   book: ""

   ========================================================= */


const MEDIA = {

    /* =====================================================
       ABC LETTERS
       ===================================================== */

    abcA: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407262832566343/97898-letter-a_1.png?ex=6a8290e9&is=6a813f69&hm=bc8c4bd7e306395a697a4ec97a53339650e0e0e0ad601f9cf1af0a71a939f4b2&",
    abcB: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407268578623538/76870-letter-b.png?ex=6a8290eb&is=6a813f6b&hm=788bfd88d1ea39727ad91c1cb2b5cf3f99ec198cb288305ce969ba1d510196c5&",
    abcC: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407252820762725/5266-letter-c.png?ex=6a8290e7&is=6a813f67&hm=748f71eca59ec9b5ded3d7812587b4b56e73f7a0eda0bf387a7e055748f0be78&",


    /* =====================================================
       SCHOOL / TEACHER DECORATIONS
       ===================================================== */

    book: "https://cdn.discordapp.com/attachments/1538407222839873656/1538408160849559583/86784-pinknotebookflip.gif?ex=6a8291bf&is=6a81403f&hm=35d85579394711bcc08d616167976d4cdf4418589807cdaea715e0262c837642&",
    pencil: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407820670799912/49781-pixelpencil.gif?ex=6a82916e&is=6a813fee&hm=8e271b24c1466fdc7f9c1b00652622c2209eae252c9cc6099b491080f355e27e&",
    star: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407979513024522/531969-scstars.png?ex=6a829194&is=6a814014&hm=a74d1d671d04f48d643260402e3adc20f9579c4429306ca7aa557c6f0df4c4d8&",
    ruler: "📐",


    /* =====================================================
       INTRO ICON
       ===================================================== */

    intro: "https://cdn.discordapp.com/attachments/1538407222839873656/1538408433458348152/143879-pastelshootingstar.png?ex=6a829200&is=6a814080&hm=711368a55db10e42258eac8ba968379eb2611dce4263063b30055458bf00eb65&",


    /* =====================================================
       HEADER DECORATIONS
       ===================================================== */

    headerBook: "https://cdn.discordapp.com/attachments/1538407222839873656/1538408731690270740/400125-purple-book.gif?ex=6a829247&is=6a8140c7&hm=a62be36cdbb77f9d515c5a35e2ae40544ac3eb7380adabdcc32c304411502670&",
    headerPencil: "https://cdn.discordapp.com/attachments/1538407222839873656/1538408725113733200/85935-notes.gif?ex=6a829246&is=6a8140c6&hm=8447f1621d770a752be39d363b72f0120c95cbb99b4870af65e1b3f3516a54ce&",


    /* =====================================================
       BIRTHDAY BADGE
       ===================================================== */

    birthdayBadge: "https://cdn.discordapp.com/attachments/1538407222839873656/1538409060104282172/279591-happybirthdaybadge.png?ex=6a829296&is=6a814116&hm=6c8062c2564b2f57d62b26e91da76b5ae38e04d5a4e8bca70a65c4f469380631&",


    /* =====================================================
       MESSAGE CARD DECORATIONS
       ===================================================== */

    messageBook: "https://cdn.discordapp.com/attachments/1538407222839873656/1538408725113733200/85935-notes.gif?ex=6a829246&is=6a8140c6&hm=8447f1621d770a752be39d363b72f0120c95cbb99b4870af65e1b3f3516a54ce&",
    messagePencil: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407820670799912/49781-pixelpencil.gif?ex=6a82916e&is=6a813fee&hm=8e271b24c1466fdc7f9c1b00652622c2209eae252c9cc6099b491080f355e27e&",
    messageStar: "https://cdn.discordapp.com/attachments/1538407222839873656/1538407979513024522/531969-scstars.png?ex=6a829194&is=6a814014&hm=a74d1d671d04f48d643260402e3adc20f9579c4429306ca7aa557c6f0df4c4d8&",


    /* =====================================================
       CAKE TOPPER
       ===================================================== */

    cakeTopper: "https://cdn.discordapp.com/attachments/1538407222839873656/1538409478658203708/86300-hangingstars.gif?ex=6a8292f9&is=6a814179&hm=2aa2a27801513a16e226956f2847fa2e2569d3fbbc922e644a2bc4affc6e91b4&"

};


/* =========================================================
   APPLY MEDIA
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       Helper
    ----------------------------------------------------- */

    function setImage(id, url) {

        const element = document.getElementById(id);

        if (!element || !url) return;

        element.src = url;

        element.style.display = "block";
    }


    function setBackgroundImage(id, url) {

        const element = document.getElementById(id);

        if (!element || !url) return;

        element.style.backgroundImage = `url("${url}")`;

        element.style.display = "block";
    }


    /* =====================================================
       ABC
       ===================================================== */

    setImage("mediaAbcA", MEDIA.abcA);
    setImage("mediaAbcB", MEDIA.abcB);
    setImage("mediaAbcC", MEDIA.abcC);


    /* =====================================================
       SCHOOL DECORATIONS
       ===================================================== */

    setImage("mediaBook", MEDIA.book);
    setImage("mediaPencil", MEDIA.pencil);
    setImage("mediaStar", MEDIA.star);
    setImage("mediaRuler", MEDIA.ruler);


    /* =====================================================
       INTRO
       ===================================================== */

    if (MEDIA.intro) {

        const intro = document.getElementById("introSchoolIcon");

        if (intro) {

            intro.innerHTML = `
                <img
                    src="${MEDIA.intro}"
                    alt=""
                >
            `;

        }

    }


    /* =====================================================
       HEADER
       ===================================================== */

    if (MEDIA.headerBook) {

        const book = document.getElementById("headerBook");

        if (book) {

            book.innerHTML = `
                <img
                    src="${MEDIA.headerBook}"
                    alt=""
                >
            `;

        }

    }


    if (MEDIA.headerPencil) {

        const pencil = document.getElementById("headerPencil");

        if (pencil) {

            pencil.innerHTML = `
                <img
                    src="${MEDIA.headerPencil}"
                    alt=""
                >
            `;

        }

    }


    /* =====================================================
       BIRTHDAY BADGE
       ===================================================== */

    if (MEDIA.birthdayBadge) {

        const badge = document.getElementById("birthdayBadge");

        if (badge) {

            badge.innerHTML = `
                <img
                    src="${MEDIA.birthdayBadge}"
                    alt=""
                >
            `;

        }

    }


    /* =====================================================
       MESSAGE CARD
       ===================================================== */

    const messageDecoration =
        document.getElementById("messageCardDecoration");


    if (
        messageDecoration &&
        (
            MEDIA.messageBook ||
            MEDIA.messagePencil ||
            MEDIA.messageStar
        )
    ) {

        messageDecoration.innerHTML = "";


        if (MEDIA.messageBook) {

            messageDecoration.innerHTML += `
                <img
                    src="${MEDIA.messageBook}"
                    alt=""
                >
            `;

        }


        if (MEDIA.messagePencil) {

            messageDecoration.innerHTML += `
                <img
                    src="${MEDIA.messagePencil}"
                    alt=""
                >
            `;

        }


        if (MEDIA.messageStar) {

            messageDecoration.innerHTML += `
                <img
                    src="${MEDIA.messageStar}"
                    alt=""
                >
            `;

        }

    }


    /* =====================================================
       CAKE TOPPER
       ===================================================== */

    if (MEDIA.cakeTopper) {

        const topper =
            document.querySelector(".abc-cake-topper");

        if (topper) {

            topper.innerHTML = `
                <img
                    src="${MEDIA.cakeTopper}"
                    alt="Teacher Birthday"
                >
            `;

        }

    }

});