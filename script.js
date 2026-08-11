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

// ==========================================
// ĐIỀU KHIỂN 3D BẰNG CHUỘT + ĐIỆN THOẠI
// ==========================================

const scene = document.getElementById("scene");
const rotator = document.getElementById("heart-rotator");


// Góc ban đầu
let rotationX = 15;
let rotationY = -20;
let rotationZ = 3;


// Zoom
let zoom = window.innerWidth <= 768 ? 0.82 : 0.72;


// Chuột / ngón tay
let dragging = false;

let lastX = 0;
let lastY = 0;


// ==========================================
// CẬP NHẬT TRÁI TIM
// ==========================================

function updateHeartTransform() {

    // Giới hạn góc nhìn lên xuống
    rotationX = Math.max(
        -75,
        Math.min(75, rotationX)
    );


    // Giới hạn zoom
    zoom = Math.max(
        0.35,
        Math.min(1.5, zoom)
    );


    rotator.style.transform = `
        rotateX(${rotationX}deg)
        rotateY(${rotationY}deg)
        rotateZ(${rotationZ}deg)
        scale(${zoom})
    `;
}


// ==========================================
// CHUỘT
// ==========================================

scene.addEventListener("pointerdown", (e) => {

    dragging = true;

    lastX = e.clientX;
    lastY = e.clientY;

    scene.setPointerCapture(e.pointerId);
});


scene.addEventListener("pointermove", (e) => {

    if (!dragging) return;


    const dx =
        e.clientX - lastX;

    const dy =
        e.clientY - lastY;


    // Kéo ngang = xoay trái phải
    rotationY += dx * 0.45;


    // Kéo dọc = nghiêng lên xuống
    rotationX -= dy * 0.35;


    lastX = e.clientX;
    lastY = e.clientY;


    updateHeartTransform();
});


scene.addEventListener("pointerup", (e) => {

    dragging = false;

    try {
        scene.releasePointerCapture(e.pointerId);
    } catch {}
});


scene.addEventListener("pointercancel", () => {

    dragging = false;

});


// ==========================================
// CUỘN CHUỘT = ZOOM
// ==========================================

scene.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();


        zoom -= e.deltaY * 0.001;


        updateHeartTransform();

    },
    {
        passive: false
    }
);

// ==========================================
// PINCH ZOOM 2 NGÓN
// ==========================================

let activePointers = new Map();

let previousDistance = null;


scene.addEventListener("pointerdown", (e) => {

    activePointers.set(
        e.pointerId,
        {
            x: e.clientX,
            y: e.clientY
        }
    );

});


scene.addEventListener("pointermove", (e) => {

    if (!activePointers.has(e.pointerId)) return;


    activePointers.set(
        e.pointerId,
        {
            x: e.clientX,
            y: e.clientY
        }
    );


    // Chỉ zoom khi có 2 ngón
    if (activePointers.size === 2) {

        const points =
            [...activePointers.values()];


        const dx =
            points[0].x -
            points[1].x;


        const dy =
            points[0].y -
            points[1].y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (previousDistance !== null) {

            const difference =
                distance -
                previousDistance;


            zoom +=
                difference * 0.003;


            updateHeartTransform();
        }


        previousDistance =
            distance;
    }

});


function removePointer(e) {

    activePointers.delete(
        e.pointerId
    );


    if (activePointers.size < 2) {

        previousDistance = null;

    }

}


scene.addEventListener(
    "pointerup",
    removePointer
);

scene.addEventListener(
    "pointercancel",
    removePointer
);

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