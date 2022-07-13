<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="canvas">
      <section class="cards">
        <?php 
        for ($i=0; $i < 4 ; $i++) { 
        ?>
        <article class="card">
          <div class="card--content">
            <a href="#">
              <img src="img/placeholder.jpg" alt="" />
              <span class="label hidden">
                <h2>Name <?php echo $i ?></h2>
                <p>Project Title <?php echo $i ?></p>
              </span>
            </a>
          </div>
        </article>
        <?php
        }
        ?>
      </section>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="//code.jquery.com/ui/1.13.1/jquery-ui.js"></script>
    <script src="jquery.ui.touch-punch.min.js"></script>

    <script src="main.js"></script>
  </body>
</html>
