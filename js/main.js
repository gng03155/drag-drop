//html 태그 
const inputBox = document.querySelector(".box-input");
const canvas = document.querySelector(".canvas");
const input = document.querySelector('.input-file');
const box = document.querySelector(".box-input");
const drawMode = document.querySelector(".draw-mode");
const imgDown = document.querySelector(".img-down");
const colorsL = document.querySelectorAll(".jsColor");
const colors = Array.prototype.slice.call(colorsL);
const clearBtn = document.querySelector(".clear");

const canvasInitLogo = document.querySelector(".init-style");
const imgLoadingLogo = document.querySelector(".loading");



// 변수
let img = new Image();
const context = canvas.getContext("2d");
const fReader = new FileReader();
let dragOvering = false;

let isPainting = false;




//화살표 함수 선언부

//드래그 인 영역
const AddDragEvent = () => {
    inputBox.addEventListener("dragover", (e) => dragOver(e));
    inputBox.addEventListener("dragenter", e => draging(e));
    inputBox.addEventListener("dragleave", (e) => draging(e));
    inputBox.addEventListener("drop", (e) => { fileDrop(e) });
}

const dragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
}

const draging = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.relatedTarget) {
        return;
    }

    const target = e.relatedTarget.className;


    if (e.type === "dragenter") {
        canvasInitLogo.style.backgroundColor = "#fff";
        return;
    } else if (target === "main-body") {
        canvasInitLogo.style.backgroundColor = "#c8dadf";
        return;
    }

}

const fileDrop = (e) => {

    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files === null) {
        return;
    }

    const file = e.dataTransfer.files[0];

    if (!file || !fileTypeCheck(file)) {
        return;
    }

    imgFileLoad(file);

}

//이미지 파일 선택해서 불러오기
const inputFileChange = (e) => {
    const file = input.files[0];

    if (!file || !fileTypeCheck(file)) {
        return;
    }
    imgFileLoad(file);

}

//이미지 파일 불러오기
const imgFileLoad = (file) => {
    canvasInitLogo.style.display = "none";
    imgLoadingLogo.style.display = "flex";
    fReader.readAsDataURL(file);
    fReader.onload = (e) => {
        imgDraw(e.target.result);
    }
}

//파일 타입 체크
const fileTypeCheck = (file) => {
    if (!file.type.includes("image")) {
        console.log(`선택된 파일타입은 ${file.type} 입니다. 이미지 파일을 불러와주세요`);
        return false;
    }

    return true;
}


//캔버스에 이미지 그리기
const imgDraw = async (src) => {

    img.src = src;
    await img.decode()
        .then((res) => {
            imgLoadingLogo.style.display = "none";
            drawMode.style.display = "block";
            initCanvas();
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        })
        .catch((err) => {
            console.error(err);
        })
}

const imgPromise = () => {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
    })
}

//캔버스 초기화 세팅
const initCanvas = () => {
    const width = Number(window.getComputedStyle(box).width.split("px")[0]);
    const height = Number(window.getComputedStyle(box).height.split("px")[0]);
    canvas.width = width;
    canvas.height = height;
}

//캔버스 페인팅

//이미지 저장
const imgDownload = async (e) => {
    // imgDown.setAttribute('href', canvas.toDataURL("image/png"));
    // let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    // window.navigator.msSaveBlob(canvas.msToBlob(), "img.jpeg");
    // window.location = window.URL.createObjectURL(imageBlob);
    //FileSaver

    saveAs(canvas.toDataURL("image/png"), "image.jpg");
}

const startPainting = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 3.5;
    isPainting = true;
}

const stopPainting = (e) => {
    isPainting = false;
}



const painting = (e) => {
    if (isPainting) {
        const x = e.offsetX;
        const y = e.offsetY;
        context.lineTo(x, y);
        context.stroke();
    }
}

const changeColor = (color) => {
    context.strokeStyle = color;
}

//클릭한 색상 사용
const handleColorClick = (event) => {
    const color = event.target.style.backgroundColor;
    changeColor(color);

}

//페인팅 컬러 이벤트 생성
const colorSet = () => {
    colors.forEach(color => {
        color.addEventListener("click", (e) => handleColorClick(e));
    });
}

const clearPainting = (e) => {
    if (img === null) {
        return;
    }
    initCanvas();
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
}


const main = () => {
    AddDragEvent();
    input.addEventListener('change', (e) => inputFileChange(e));
    imgDown.addEventListener("click", (e) => imgDownload(e));
    initCanvas();
    colorSet();


    canvas.addEventListener("mousedown", (e) => startPainting(e));
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", (e) => painting(e));
    clearBtn.addEventListener("click", clearPainting);


}

main();