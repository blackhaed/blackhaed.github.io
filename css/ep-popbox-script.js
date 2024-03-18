/**
 * Everyday Practice Popbox
 * 
 * @package   ep-popbox
 * @author    Everyday Practice
 * @link      http://www.everyday-practice.com/
 * @copyright 2022 Everyday Practice 
 * YS
 *
 */

 $ = (a) => { let target = document.querySelectorAll(a); let out = (target.length > 1) ? target : target[0]; return out; }
 const getStringToHTML = (str) => { const div = document.createElement("div"); div.innerHTML = str; return div; }
 
 let bodyScrollLock = false;
 let popboxInit = false;
 
 const handleBodyScroll = () => {
     bodyScrollLock = !bodyScrollLock;
     if (bodyScrollLock) {
         // document.body.classList.add("ep-not-scroll");
     } else {
         // document.body.classList.remove("ep-not-scroll");
     }
 }
 
 // url의 html text를 ajax로 받아옴
 const getPopboxData = async (url) => {
     const options = {
         method: 'GET',
         mode: 'cors',
         cache: 'no-cache',
         credentials: 'same-origin',
         redirect: 'follow', // manual, *follow, error
         referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, 
     }
 
     const res = await fetch(url, options);
     const req = await res.text();
 
     if (req) {
         return req;
 
     } else {
         console.log("error")
         console.log(res.status);
 
         return false;
     }
 }
 
 const getPopboxDataId = async (post_id) => {
     return new Promise(function (resolve, reject) {
         jQuery.ajax({
             type: "post",
             url: "/wp-admin/admin-ajax.php",
             data: {
                 action: 'ep_get_post_content',
                 post_id
             },
             ajax: false,
             dataType: 'json',
             beforeSend: function () {
 
             },
             complete: function (xhr) {
                 // console.log(xhr.responseJSON);
                 if (xhr.status !== 200) {
                     reject(xhr.status);
                     alert("문제가 생겨 댓글을 저장하지 못했습니다. \n개발자에게 문의해주세요.")
                 } else {
                     resolve(xhr.status);
                 };
             }
         })
     })
 }
 
 //popup box 그려줌
 const drawPopupBox = () => {
 
     const container = document.createElement("div");
     // const containerName = (!popboxInit) ? "ep-popupbox-container active" : "ep-popupbox-container";
     container.className = "ep-popupbox-container";
     const popbox = `
         <div class="ep-popupbox-overlay"></div>
         <div class="ep-popupbox-wrapper">
             <div class="ep-popupbox-close">
                 <span></span>
                 <span></span>
             </div>
             <div class="ep-popupbox-loading">
                 <?xml version="1.0" encoding="utf-8"?>
                 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                     <circle cx="50" cy="20" r="10" fill="#000000">
                     <animate attributeName="cy" dur="1.2048192771084336s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9" keyTimes="0;0.5;1" values="20;80;20"></animate>
                     </circle>
                 </svg>
             </div>
             <div class="content-scroller"></div>
             <div class="more-grad"></div>
         </div>
         
     `;
 
     container.innerHTML = popbox;
     container.querySelector(".ep-popupbox-overlay").addEventListener("click", handlePopboxClose);
     container.querySelector(".ep-popupbox-close").addEventListener("click", handlePopboxClose);
     return container;
 
 }
 
 const handlePopboxClose = () => {
     handleBodyScroll();
     $(".ep-popupbox-container").classList.remove("active");
     $(".ep-popupbox-container").classList.remove("success");
     setTimeout(() => {
         $(".ep-popupbox-container").style.display = "none";
     }, 200)
 }
 
 const handlePopboxOpen = (data, script_arr) => {
     
     handleBodyScroll();
     setTimeout(() => {
         $(".ep-popupbox-container").classList.remove("loading")
         $(".ep-popupbox-container").classList.add("success")
     }, 10)
     $(".ep-popupbox-container .content-scroller").innerHTML = data;
     script_arr.forEach((el) => {
         if (el.tagName === "SCRIPT") {
             if([ ... document.querySelectorAll("script")].some(re=>el.src===re.src) === false) {
                 loadJavascript($(".ep-popupbox-container .content-scroller"), el.src)
             };
         } else if (el.tagName === "LINK" && el.rel ==="stylesheet") {
             loadCSS($(".ep-popupbox-container .content-scroller"), el.href)
         }
     })
 }
 function loadJavascript(container, url) {
     var script = document.createElement('script');
     script.type = 'text/javascript';
 
     var loaded = false;
     script.onreadystatechange = function () {
         if (this.readyState == 'loaded' || this.readyState == 'complete') {
             if (loaded) {
 
                 return;
             }
             loaded = true;
         }
     }
     script.onload = function () {
         // 로드완료
         // CommMethod();			// 공통 메서드 실행하기
     }
     script.src = url;
     container.appendChild(script);
 }
 function loadCSS(container, url) {
     var stylesheet = document.createElement('link');
     stylesheet.rel = "stylesheet";
     stylesheet.type = 'text/css';
 
     var loaded = false;
     stylesheet.onreadystatechange = function () {
         if (this.readyState == 'loaded' || this.readyState == 'complete') {
             if (loaded) {
 
                 return;
             }
             loaded = true;
         }
     }
     stylesheet.onload = function () {
         // 로드완료
         // CommMethod();			// 공통 메서드 실행하기
     }
     stylesheet.href = url;
     
     container.appendChild(stylesheet);
 }
 
 // 아이템 박스 누를 시 실행
 const handlePopboxTrigger = async (item) => {
     if (!popboxInit) {
         const popbox = drawPopupBox();
         document.body.appendChild(popbox);
         popboxInit = true;
     } else {
         $(".ep-popupbox-container .content-scroller").innerHTML = '';
     }
     $(".ep-popupbox-container").style.display = "block";
     setTimeout(() => { $(".ep-popupbox-container").classList.add("active") }, 10)
     setTimeout(() => { $(".ep-popupbox-container").classList.add("loading") }, 10)
 
 
     const url = item.href;
     const data = (url) ? await getPopboxData(url) : null;
     const content = (data) ? getStringToHTML(data).querySelector("#main-content").outerHTML : false;
 
     const body_children_arr = [...getStringToHTML(data).children];
     const script_arr = [];
     body_children_arr.forEach((child, idx) => {
          if (idx !== body_children_arr.findIndex((el) => el.id === "page-container")) script_arr.push(child);
     });
 
     if (content) {
         handlePopboxOpen(content, script_arr);
         multilingualContainerHandler(".content-scroller", ".content-scroller .ml")
     } else {
         alert("문제가 생겨 정보를 불러올 수 없습니다. 🥲");
     }
 }
 
 
 //초기 실행
 const ep_popbox_init = () => {
     document.querySelectorAll(".ep-popbox-item").forEach((item) => {
         item.addEventListener("click", (e) => {
             e.preventDefault();
             handlePopboxTrigger(item)
         })
     })
 }
 
 jQuery(document).ajaxSuccess(() => { 
     ep_popbox_init()
  })
 ep_popbox_init();
 
 