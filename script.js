const heart = document.getElementById("heart");

const text = "Long ❤️ Hoài Thương";

// ===============================
// THIẾT LẬP
// ===============================

const total = 100;
const layers = 2;
const depth = 20;

const words = [];


// ===============================
// PHÁT HIỆN MÀN HÌNH
// ===============================

function isMobile() {
    return window.innerWidth <= 768;
}


// ===============================
// TỶ LỆ HÌNH TRÁI TIM
// ===============================

function getHeartScale() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    const size = Math.min(width, height);

    // Điện thoại
    if (width <= 768) {
        return size * 0.018;
    }

    // Máy tính
    return 30;
}


// ===============================
// PHƯƠNG TRÌNH TRÁI TIM
// ===============================

function heartPoint(t) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    const scale = getHeartScale();

    return {
        x: x * scale,

        y:
            (-y * scale * 0.85)
            + Math.sin(t) * 2
    };
}


// ===============================
// TẠO CHỮ
// ===============================

for (let layer = 0; layer < layers; layer++) {

    const z =
        (layer - (layers - 1) / 2) * depth;

    for (let i = 0; i < total; i++) {

        const t =
            (Math.PI * 2 * (i + 0.35)) / total;

        const word =
            document.createElement("div");

        word.className = "word";

        word.innerText = text;

        word.dataset.t = t;
        word.dataset.z = z;

        heart.appendChild(word);

        words.push(word);
    }
}


// ===============================
// LÀM MƯỢT GÓC
// ===============================

const lastAngles = new WeakMap();

let offset = 0;


// ===============================
// ANIMATION
// ===============================

function animate() {

    // Chạy chậm và đều
    offset += isMobile()
        ? 0.0025
        : 0.0035;


    // ===========================
    // CAMERA
    // ===========================

    if (isMobile()) {

        // Điện thoại
        heart.style.transform = `
            scale(0.88)
            rotateX(10deg)
            rotateY(-10deg)
            rotateZ(3deg)
        `;

    } else {

        // Máy tính
        heart.style.transform = `
            scale(0.72)
            rotateX(20deg)
            rotateY(-20deg)
            rotateZ(8deg)
        `;
    }


    // ===========================
    // CHỮ
    // ===========================

    words.forEach((word) => {

        const shapeT =
            parseFloat(word.dataset.t);

        const moveT =
            shapeT + offset;


        // Vị trí trên viền
        const p =
            heartPoint(moveT);


        // Điểm trước
        const pPrev =
            heartPoint(moveT - 0.01);

        // Điểm sau
        const pNext =
            heartPoint(moveT + 0.01);


        // Hướng chuyển động
        const dx =
            pNext.x - pPrev.x;

        const dy =
            pNext.y - pPrev.y;


        const angle =
            Math.atan2(dy, dx)
            * 180 / Math.PI;


        // Làm mượt góc
        const oldAngle =
            lastAngles.get(word) ?? angle;


        const smoothAngle =
            oldAngle * 0.97 +
            angle * 0.03;


        lastAngles.set(
            word,
            smoothAngle
        );


        // ===========================
        // ĐỘ SÂU 3D
        // ===========================

        const baseZ =
            parseFloat(word.dataset.z);


        const z =
            baseZ +
            Math.sin(moveT * 3) * 2;


        // ===========================
        // ĐỘ MỜ
        // ===========================

        const alpha =
            1 -
            Math.abs(z) /
            (layers * depth * 1.5);


        word.style.opacity =
            Math.max(0.35, alpha);


        // ===========================
        // XOAY CHỮ
        // ===========================

        word.style.transform = `
            translate3d(
                ${p.x}px,
                ${p.y}px,
                ${z}px
            )

            rotateZ(${smoothAngle * 0.15}deg)

            rotateY(${isMobile() ? 5 : 12}deg)

            scale(1)
        `;

    });


    requestAnimationFrame(animate);
}


animate();


// ===============================
// CLICK / TOUCH BUNG TIM
// ===============================

document.addEventListener(
    "pointerdown",
    (e) => {

        // Không tạo quá nhiều trên điện thoại
        const totalHearts =
            isMobile() ? 16 : 28;


        const icons = [
            "❤️",
            "💖",
            "💕",
            "💗",
            "💘",
            "💝"
        ];


        for (
            let i = 0;
            i < totalHearts;
            i++
        ) {

            const particle =
                document.createElement("div");


            particle.className =
                "click-heart";


            particle.innerHTML =
                icons[
                    Math.floor(
                        Math.random() *
                        icons.length
                    )
                ];


            // Kích thước
            const size =
                isMobile()
                    ? 16 + Math.random() * 18
                    : 18 + Math.random() * 24;


            particle.style.fontSize =
                size + "px";


            particle.style.left =
                e.clientX + "px";

            particle.style.top =
                e.clientY + "px";


            document.body.appendChild(
                particle
            );


            // Góc bay
            const angle =
                Math.random() *
                Math.PI * 2;


            // Khoảng cách
            const distance =
                isMobile()
                    ? 60 + Math.random() * 140
                    : 80 + Math.random() * 220;


            const x =
                Math.cos(angle) *
                distance;


            const y =
                Math.sin(angle) *
                distance;


            const rotate =
                Math.random() *
                720 - 360;


            const duration =
                isMobile()
                    ? 800 + Math.random() * 500
                    : 900 + Math.random() * 700;


            particle.animate(

                [

                    {
                        transform:
                            `
                            translate(
                                -50%,
                                -50%
                            )
                            scale(.2)
                            rotate(0deg)
                            `,

                        opacity: 1
                    },


                    {

                        offset: .2,

                        transform:
                            `
                            translate(
                                calc(
                                    -50% +
                                    ${x * 0.3}px
                                ),

                                calc(
                                    -50% +
                                    ${y * 0.3}px
                                )
                            )

                            scale(1.15)

                            rotate(
                                ${rotate / 2}deg
                            )
                            `,

                        opacity: 1
                    },


                    {

                        transform:
                            `
                            translate(
                                calc(
                                    -50% +
                                    ${x}px
                                ),

                                calc(
                                    -50% +
                                    ${y}px
                                )
                            )

                            scale(.3)

                            rotate(
                                ${rotate}deg
                            )
                            `,

                        opacity: 0
                    }

                ],

                {

                    duration,

                    easing:
                        "cubic-bezier(.17,.89,.32,1.25)",

                    fill: "forwards"
                }

            );


            setTimeout(() => {

                particle.remove();

            }, duration);

        }

    },
    {
        passive: true
    }
);


// ===============================
// KHI XOAY MÀN HÌNH
// ===============================

window.addEventListener(
    "resize",
    () => {

        // ép trình duyệt tính lại
        // kích thước trái tim

        heart.style.transform =
            "none";

    }
);