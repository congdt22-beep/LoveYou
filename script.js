const heart = document.getElementById("heart");

const text = "I love Mai❤️";
const total = 100;            // tổng lượng chữ

// Phương trình hình trái tim
function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: x * 30,
        y: (-y * 25) + Math.sin(t) * 3
    };
}

const words = [];

const layers = 2;      // số lớp
const depth = 20;         // khoảng cách giữa các lớp

for(let layer=0; layer<layers; layer++){

    const z = (layer - layers/2) * depth;

    for(let i=0;i<total;i++){

        const t = 
        (Math.PI*2*(i+0.35))/total;

        const word = document.createElement("div");

        word.className = "word";

        word.innerText = text;

        word.dataset.t = t;

        word.dataset.z = z;

        heart.appendChild(word);

        words.push(word);

    }

}

const lastAngles = new WeakMap();

let offset = 0;

function animate() {
    // tốc độ chạy
    offset += 0.005;

    heart.style.transform =
    `
    scale(0.72)
    rotateX(20deg)
    rotateY(-20deg)
    rotateZ(8deg)
    `;

    words.forEach((word)=>{

        const shapeT = parseFloat(word.dataset.t);

        const moveT = shapeT + offset;

        // chạy theo viền chữ
        const p = heartPoint(moveT);

        // điểm kế tiếp để tính hướng
        const pPrev = heartPoint(moveT - 0.01);
        const pNext = heartPoint(moveT + 0.01);

        const dx = pNext.x - pPrev.x;
        const dy = pNext.y - pPrev.y;

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const oldAngle = lastAngles.get(word) ?? angle;

        const smoothAngle = oldAngle * 0.96 + angle * 0.04;

        lastAngles.set(word, smoothAngle);

        const z = 
        parseFloat(word.dataset.z)
        +
        Math.sin(moveT*3)*3;     // tần giao động

        const alpha =
        1-Math.abs(z)/(layers*depth);

        word.style.opacity = alpha;

        word.style.transform =
        `
        translate3d(${p.x}px,${p.y}px,${z}px)
        rotateZ(${smoothAngle * 0.2}deg)
        rotateY(12deg)
        scale(1)
        `;

    });

    requestAnimationFrame(animate);

}

animate();


document.addEventListener("click",(e)=>{

    const icons=[
        "❤️",
        "💖",
        "💕",
        "💗",
        "💘",
        "💝"
    ];

    const totalHearts=28;

    for(let i=0;i<totalHearts;i++){

        const heart=document.createElement("div");

        heart.className="click-heart";

        heart.innerHTML=
        icons[
            Math.floor(Math.random()*icons.length)
        ];

        const size=18+Math.random()*24;

        heart.style.fontSize=size+"px";

        heart.style.left=e.clientX+"px";
        heart.style.top=e.clientY+"px";

        document.body.appendChild(heart);

        // Góc bay
        const angle=Math.random()*Math.PI*2;

        // Khoảng cách
        const distance=80+Math.random()*220;

        const x=Math.cos(angle)*distance;

        const y=Math.sin(angle)*distance;

        // Xoay
        const rotate=Math.random()*720-360;

        // Thời gian
        const duration=900+Math.random()*700;

        heart.animate(

            [

                {
                    transform:
                    `translate(-50%,-50%)
                    scale(.2)
                    rotate(0deg)`,

                    opacity:1
                },

                {
                    offset:.2,

                    transform:
                    `translate(
                    calc(-50% + ${x*0.3}px),
                    calc(-50% + ${y*0.3}px))
                    scale(1.2)
                    rotate(${rotate/2}deg)`,

                    opacity:1
                },

                {

                    transform:
                    `translate(
                    calc(-50% + ${x}px),
                    calc(-50% + ${y}px))
                    scale(.3)
                    rotate(${rotate}deg)`,

                    opacity:0

                }

            ],

            {

                duration:duration,

                easing:"cubic-bezier(.17,.89,.32,1.25)",

                fill:"forwards"

            }

        );

        setTimeout(()=>{

            heart.remove();

        },duration);

    }

});

document.addEventListener("click",(e)=>{

    for(let i=0;i<12;i++){

        const heart=document.createElement("div");

        heart.className="click-heart";

        const icons=[
            "❤️",
            "💖",
            "💗",
            ];

            heart.innerHTML=
            icons[Math.floor(Math.random()*icons.length)];

        heart.style.left=e.clientX+"px";
        heart.style.top=e.clientY+"px";

        heart.style.fontSize=(20+Math.random()*20)+"px";

        const x=(Math.random()-0.5)*120;
        const y=(Math.random()-0.5)*80;

        heart.animate(

            [

                {
                    transform:`translate(-50%,-50%)`
                },

                {
                    transform:`
                    translate(
                        calc(-50% + ${x}px),
                        calc(-50% - 150px + ${y}px)
                    )
                    scale(${0.6+Math.random()})
                    rotate(${Math.random()*120-60}deg)
                    `
                }

            ],

            {

                duration:1000+Math.random()*600,

                easing:"ease-out"

            }

        );

        document.body.appendChild(heart);

        setTimeout(()=>{

            heart.remove();

        },1700);

    }

});