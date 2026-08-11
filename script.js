const heart = document.getElementById("heart");

const text = "Long ❤️ Hoài Thương";

// ===============================
// THIẾT LẬP
// ===============================

const total = 40;
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
// ĐIỀU KHIỂN 3D - PC + ĐIỆN THOẠI
// ==========================================

const scene = document.getElementById("scene");
const rotator = document.getElementById("heart-rotator");


// ===============================
// TRẠNG THÁI 3D
// ===============================

let rotationX = 15;
let rotationY = -20;
let rotationZ = 3;

let zoom =
    window.innerWidth <= 768
        ? 0.82
        : 0.72;


// ===============================
// POINTER
// ===============================

const pointers = new Map();

let lastSingleX = 0;
let lastSingleY = 0;

let previousDistance = null;

let moved = false;


// ===============================
// CẬP NHẬT 3D
// ===============================

function updateHeartTransform() {

    // Giới hạn góc nhìn
    rotationX = Math.max(
        -80,
        Math.min(80, rotationX)
    );


    // Zoom
    zoom = Math.max(
        0.35,
        Math.min(1.6, zoom)
    );


    rotator.style.transform = `
        rotateX(${rotationX}deg)
        rotateY(${rotationY}deg)
        rotateZ(${rotationZ}deg)
        scale(${zoom})
    `;
}


// Hiển thị ngay góc ban đầu
updateHeartTransform();


// ===============================
// KHOẢNG CÁCH 2 NGÓN
// ===============================

function getDistance() {

    const values =
        [...pointers.values()];

    if (values.length < 2) {
        return null;
    }

    const dx =
        values[0].x -
        values[1].x;

    const dy =
        values[0].y -
        values[1].y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ===============================
// CHẠM / NHẤN
// ===============================

scene.addEventListener(
    "pointerdown",
    (e) => {

        pointers.set(
            e.pointerId,
            {
                x: e.clientX,
                y: e.clientY
            }
        );


        moved = false;


        // 1 ngón
        if (pointers.size === 1) {

            lastSingleX =
                e.clientX;

            lastSingleY =
                e.clientY;
        }


        // 2 ngón
        if (pointers.size === 2) {

            previousDistance =
                getDistance();
        }


        // Giữ pointer trên scene
        try {

            scene.setPointerCapture(
                e.pointerId
            );

        } catch {}

    },
    {
        passive: true
    }
);


// ===============================
// KÉO / XOAY / ZOOM
// ===============================

scene.addEventListener(
    "pointermove",
    (e) => {

        if (!pointers.has(e.pointerId)) {
            return;
        }


        // Cập nhật vị trí
        pointers.set(
            e.pointerId,
            {
                x: e.clientX,
                y: e.clientY
            }
        );


        // =================================
        // 1 NGÓN
        // =================================

        if (pointers.size === 1) {

            const dx =
                e.clientX -
                lastSingleX;

            const dy =
                e.clientY -
                lastSingleY;


            // Nếu di chuyển đủ lớn
            if (
                Math.abs(dx) > 1 ||
                Math.abs(dy) > 1
            ) {

                moved = true;
            }


            // Kéo ngang
            // → xoay 360°
            rotationY +=
                dx * 0.45;


            // Kéo dọc
            // → nghiêng
            rotationX -=
                dy * 0.30;


            lastSingleX =
                e.clientX;

            lastSingleY =
                e.clientY;


            updateHeartTransform();
        }


        // =================================
        // 2 NGÓN
        // =================================

        if (pointers.size === 2) {

            const distance =
                getDistance();


            if (
                distance !== null &&
                previousDistance !== null
            ) {

                const difference =
                    distance -
                    previousDistance;


                // Pinch zoom
                zoom +=
                    difference * 0.003;


                updateHeartTransform();
            }


            previousDistance =
                distance;
        }

    },
    {
        passive: true
    }
);


// ===============================
// THẢ NGÓN
// ===============================

scene.addEventListener(
    "pointerup",
    (e) => {

        pointers.delete(
            e.pointerId
        );


        if (pointers.size < 2) {

            previousDistance =
                null;
        }


        try {

            scene.releasePointerCapture(
                e.pointerId
            );

        } catch {}

    }
);


// ===============================
// CANCEL
// ===============================

scene.addEventListener(
    "pointercancel",
    (e) => {

        pointers.delete(
            e.pointerId
        );

        previousDistance =
            null;
    }
);


// ===============================
// CHUỘT SCROLL = ZOOM
// ===============================

scene.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();


        zoom -=
            e.deltaY * 0.001;


        updateHeartTransform();

    },
    {
        passive: false
    }
);


// ==========================================
// CLICK / CHẠM → BUNG TIM
// ==========================================

scene.addEventListener(
    "pointerup",
    (e) => {

        // Nếu đang kéo thì KHÔNG bung tim
        if (moved) {
            return;
        }


        // Nếu vừa dùng 2 ngón thì không bung
        if (pointers.size > 0) {
            return;
        }


        createExplosion(
            e.clientX,
            e.clientY
        );

    }
);


// ==========================================
// TẠO TIM BUNG
// ==========================================

function createExplosion(x, y) {

    const icons = [
        "❤️",
        "💖",
        "💕",
        "💗",
        "💘",
        "💝"
    ];


    const totalHearts =
        window.innerWidth <= 768
            ? 16
            : 28;


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


        const size =
            window.innerWidth <= 768
                ? 16 + Math.random() * 18
                : 18 + Math.random() * 24;


        particle.style.fontSize =
            size + "px";


        particle.style.left =
            x + "px";

        particle.style.top =
            y + "px";


        document.body.appendChild(
            particle
        );


        const angle =
            Math.random() *
            Math.PI * 2;


        const distance =
            window.innerWidth <= 768
                ? 60 + Math.random() * 140
                : 80 + Math.random() * 220;


        const endX =
            Math.cos(angle) *
            distance;


        const endY =
            Math.sin(angle) *
            distance;


        const rotate =
            Math.random() *
            720 - 360;


        const duration =
            window.innerWidth <= 768
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

                    offset: 0.2,

                    transform:
                        `
                        translate(
                            calc(
                                -50% +
                                ${endX * 0.3}px
                            ),
                            calc(
                                -50% +
                                ${endY * 0.3}px
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
                                ${endX}px
                            ),
                            calc(
                                -50% +
                                ${endY}px
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
                duration: duration,

                easing:
                    "cubic-bezier(.17,.89,.32,1.25)",

                fill: "forwards"
            }
        );


        setTimeout(
            () => particle.remove(),
            duration
        );

    }
}

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