let localContent = []
let globalContent = []
let selectedItem

const modalContainer = document.getElementById("modalContainer");
//모달 open
function modalOpen(e) {
    const modalContainer = document.getElementById("modalContainer");
    const index = e.getAttribute("index");

    const modalContent = document.getElementById("modal_item"+index);
    selectedItem = index;
    modalContent.style.display = "flex"
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
    fetch('./localContents.json')
        .then(res => res.json())
        .then(data => localContent = data)
        .then(()=>contentsLoad(localContent));
    //글로벌 컨텐츠 불러와서 데이터 저장
    fetch('./globalContents.json')
        .then(res => res.json())
        .then(data => globalContent = data)
})
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
        const imageHTML = imageHTMLarr.join('')
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
                <ul class="imgList">
                    
                    ${imageHTML}                    
                </ul>
            </div>
            <div class="descriptionBox">
                    <span>${content.description}<span>
            </div>
        </div>
        `;
    })
}
//국내 해외 버튼 핸들러
function handleLocationChange(e){
    const buttons = document.querySelectorAll("nav button");
    if(e.id == "localBtn"){
        buttons[1].classList.remove("active");
        buttons[0].classList.add("active");
        contentsLoad(localContent);
    } else {
        buttons[0].classList.remove("active");
        buttons[1].classList.add("active");
        contentsLoad(globalContent);

    }
}
//검색
function handleSearch(){
    const inputLocation = document.getElementById("inputLocation").value.trim()
    const location = document.getElementsByClassName('location');
    const itemCard = document.getElementsByClassName('itemCard');
    console.log(location);
    if(inputLocation == ""){
        for(let i = 0; i< itemCard.length; i++){
            itemCard[i].classList.remove('disable')
        }
    } else {
        let removeCard = [];
        for(let i = 0; i < location.length; i++){
            if(location[i].innerText.search(inputLocation)==-1){
                removeCard.push(itemCard[i])
            } else {
                itemCard[i].classList.remove('disable')
            }
        }
        for(let i = 0; i< removeCard.length; i++){
            removeCard[i].classList.add('disable')
        }
    }
    
}
//모달 내부 이미지 핸들러
function handleBullet(e, dir) {
    const element = e.target;
    const index = element.getAttribute("index");
    const images = document.querySelectorAll("#modal_item" + index + " li");
    if(dir == "right"){
        handleRight(images);
    } else {
        handleLeft(images);
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
    console.log(images)
    let index = getImageIndex(images)
    if(index == images.length-1) {
        return;
    }
    index++;
    images[index].classList.add("display");
    images[index-1].classList.remove("display");
}

    
