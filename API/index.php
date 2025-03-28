<?php
    echo <<<IDEN
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../src/main_style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/453e6bda0e.js" crossorigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css2?family=Playwrite+IT+Moderna:wght@100..400&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Rubik+Gemstones&display=swap" rel="stylesheet">
        <title>Document</title>
    </head>
    <body>
        <div class="nav">
            <div class="elements elements--shoppingcart">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div class="elements elements__middle">
                <div class="elements__middle--top">
                    <h1 id="shop-name">QLaptop</h1>
                </div>
                <div class="elements__middle--bot">
                    <input placeholder="Hãy tìm mặt hàng bạn muốn mua nào..." class="elements--searchbox">
                    <button class="elements--searchbutton">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>
            <div class="nav--right"> 
                <div class="flex-element">
                    <a class=" login" href="">Đăng nhập</a>
                </div>
                <div class="flex-element">
                    <a class=" logout" href="">Đăng ký</a>
                </div>
            </div>
        </div>
        <div class="slider">
            <div class="slides">
              <img id="img_1" class="slider--image" src="../assets/slide_image1.webp" alt="">
              <img id="img_2" class="slider--image" src="../assets/slide_image2.webp" alt="">
            </div>
            <img id="previous--image" class="slider--button" src="../assets/left-arrow.svg" alt="Previous">
            <img id="next--image" class="slider--button" src="../assets/right-arrow.svg" alt="Next">
            <div class="navigation">
              <label for="img_1" class="nav-dot"></label>
              <label for="img_2" class="nav-dot"></label>
            </div>
        </div>
        <div class="best-seller">
            <div class="best-seller__title">
                <h3 id="best-seller__title">Best Seller</h3>
            </div>
            <div class="best-seller__products" id="products_container">
                
            </div>
        </div>
        <script src="../src/move-slide.js"></script>
        <script src="../src/get_best_sellers.js"></script>
    </body>
    </html>
IDEN;
?>
