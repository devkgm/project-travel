let allContent = [];
let localContent = [];
let globalContent = [];
let selectedItem;

const modalContainer = document.getElementById("modalContainer");
//모달 open
function modalOpen(e) {
    const modalContainer = document.getElementById("modalContainer");
    const index = e.getAttribute("index");
    const modalContent = document.getElementById("modal_item"+index);
    const img = document.querySelectorAll("#modal_item"+index+" .imgList li");
    const arrowRight = document.querySelector("#modal_item"+index+" .right");
    const arrowLeft = document.querySelector("#modal_item"+index+" .left");
    //이미지 위치에 따라 화살표 비활성화 및 활성화
    arrowRight.addEventListener('click',()=>{
        let imgIndex = getImageIndex(img);
        if(imgIndex == img.length-1){
            arrowRight.classList.add("disable");
        } else {
            arrowRight.classList.remove("disable");
        }
        if(imgIndex != 0){
            arrowLeft.classList.remove("disable");
        }
    })
    arrowLeft.addEventListener('click',()=>{
        let imgIndex = getImageIndex(img);
        if(imgIndex == 0){
            arrowLeft.classList.add("disable");
        } else {
            arrowLeft.classList.remove("disable");
        }
        if(imgIndex < img.length-1){
            arrowRight.classList.remove("disable");
        }
    })
    let imgIndex = getImageIndex(img);
    if(imgIndex == 0){
        arrowLeft.classList.add("disable");
    }
    if(img.length <= 1){
        arrowRight.classList.add("disable");
    }
    //모달 open
    selectedItem = index;
    modalContent.style.display = "flex";
    modalContainer.style.display = "block";
}
//모달창 외부 클릭시 모달 close
window.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
        modalContainer.style.display = "none";
        const modalContent = document.getElementById("modal_item"+selectedItem);
        modalContent.style.display = "none";
    }
});
//DOM 로드 완료시 컨텐츠 불러오기
document.addEventListener("DOMContentLoaded", () => {
    //로컬 컨텐츠 불러와서 바로 컨텐츠 로드
    fetch('./Contents.json')
        .then(res => res.json())
        .then(data => allContent = data)
        .then(()=>{
            contentsLoad(allContent);
            classificationContent(allContent);
        });
})
function classificationContent(allContent){
    allContent.forEach((content, index)=>{
        if(content.country == "domestic"){
            localContent.push(content);
        } else {
            globalContent.push(content);
        }
    })
}
//컨텐츠 로드 함수
function contentsLoad(contents){
    const itemContainer = document.getElementById("itemContainer");
    const modalContainer = document.getElementById("modalContainer")
    itemContainer.innerHTML = "";
    modalContainer.innerHTML = "";
    contents.map((content, index) => {
        itemContainer.innerHTML += `
        <div class="itemCard">
            <a href="javascript:void(0)" onclick="modalOpen(this);" id="item${index}" index="${index}"">
                <div class="image">
                    <div class="hover">
                        <span class="location">${content.location}</span>
                    </div>
                    <img src="${content.thumnail}" alt="thumnail">
                </div>
            </a>
        </div>
        `;
        const imageHTMLarr = content.images.map((image, index) => {
            if(index == 0){
                return `<li class="display"><img src="${image}" alt="image"></li>`;
            }
            return `<li><img src="${image}" alt="image"></li>`;
        })
        const bulletArr = content.images.map((image, index) => {
            if(index == 0){
                return `<li class="bullet">.</li>`;
            }
            return `<li>.</li>`;
        })
        const imageHTML = imageHTMLarr.join('')
        const bullet = bulletArr.join('')
        modalContainer.innerHTML += `
        <div class="modalContent" id="modal_item${index}">
            
            <div class="imageBox">
                <div class="arrowBox">
                    <div class="arrow right" onclick="handleBullet(event, 'right');" index="${index}">
                        >
                    </div>
                    <div class="arrow left" onclick="handleBullet(event, 'left');" index="${index}">
                        <
                    </div>
                </div>
                <div class="bulletBox">
                    <ul class="bulletList">
                        ${bullet}
                    </ul>
                </div>
                <ul class="imgList">
                    ${imageHTML}                    
                </ul>
            </div>
            <div class="descriptionBox">
                <div class="title">
                    ${content.title}
                </div>
                <div class="duration">
                    일정 : ${content.date}
                </div>
                <div class="description">
                    <span style="font-style: italic;">여행 한 줄 소감</span> <br>
                    ${content.description}
                </div>
                <div class="map">
                <iframe src="${content.googlemap}" width="500" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
        `;
    })
}
//국내 해외 버튼 핸들러
function handleLocationChange(e){
    const buttons = document.querySelectorAll("nav button");
    if(e.id == "allBtn"){
        buttons[0].classList.add("active");
        buttons[1].classList.remove("active");
        buttons[2].classList.remove("active");
        contentsLoad(allContent);
    } else if(e.id == "localBtn") {
        buttons[0].classList.remove("active");
        buttons[1].classList.add("active");
        buttons[2].classList.remove("active");
        contentsLoad(localContent);
    } else {
        buttons[0].classList.remove("active");
        buttons[1].classList.remove("active");
        buttons[2].classList.add("active");
        contentsLoad(globalContent);
    }
}
//검색
function handleSearch(){
    const inputLocation = document.getElementById("inputLocation").value.trim();
    const location = document.getElementsByClassName('location');
    const itemCard = document.getElementsByClassName('itemCard');
    console.log(location);
    if(inputLocation == ""){
        for(let i = 0; i< itemCard.length; i++){
            itemCard[i].classList.remove('disable');
        }
    } else {
        let removeCard = [];
        for(let i = 0; i < location.length; i++){
            if(location[i].innerText.search(inputLocation)==-1){
                removeCard.push(itemCard[i]);
            } else {
                itemCard[i].classList.remove('disable');
            }
        }
        for(let i = 0; i< removeCard.length; i++){
            removeCard[i].classList.add('disable');
        }
    }
    
}
//모달 내부 이미지 핸들러
function handleBullet(e, dir) {
    const element = e.target;
    const index = element.getAttribute("index");
    const images = document.querySelectorAll("#modal_item" + index + " .imgList li");
    const bullet = document.querySelectorAll("#modal_item" + index + " .bulletList li");
    if(dir == "right"){
        handleRight(images);
    } else {
        handleLeft(images);
    }
    let imgIndex = getImageIndex(images)
    for(let i = 0; i < bullet.length; i++){
        if(i == imgIndex){
            bullet[i].classList.add('bullet');
        } else {
            bullet[i].classList.remove('bullet');
        }
    }
    
}
//슬라이드 로직
function getImageIndex(images) {
    let index;
    images.forEach((element,idx) => {
        if(element.classList.contains("display")) {
            return index = idx;
        }
    });
    return index;
}
function handleLeft(images) {
    let index = getImageIndex(images)
    if(index == 0) {
        return;
    }
    index--;
    images[index].classList.add("display");
    images[index+1].classList.remove("display");
}
function handleRight(images) {
    let index = getImageIndex(images);
    if(index == images.length-1) {
        return;
    }
    index++;
    images[index].classList.add("display");
    images[index-1].classList.remove("display");
}

    
