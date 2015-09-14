
<?php $data = urldecode($_GET["pais"]);
$json_data = json_decode($data, TRUE);
?>
<div class="header-valores">
   <h2>
      <div class="header-data-1">
         <div class="big-flag left" id="big-flag-">
         </div>
         <span class="moeda">R$</span> 
      </div>
      <div class="header-data-2">
         <span class="valor-total">
            <?php echo number_format(($json_data["valor_real"] * 1000000), 0, ',', '.'); ?>
         </span>
      </div>
      <div class="header-data-3">
         <span class="data-atualizacao"></span>
      </div>
   </h2>
   <p class="slot-data">É a soma do valor de mercado dos jogadores desta seleção<span class="required">*</span></p>
</div>
<div class="ranking floater">
   <span class="title-ranking group-title">Valor de mercado</span>
   <ul class="lista-ranking inline-list left">
      <li data-pos="1">
         <span class="posicao">1o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="2">
         <span class="posicao">2o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="3">
         <span class="posicao">3o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="4">
         <span class="posicao">4o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="5">
         <span class="posicao">5o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="6">
         <span class="posicao">6o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="7">
         <span class="posicao">7o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="8">
         <span class="posicao">8o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="9">
         <span class="posicao">9o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="10">
         <span class="posicao">10o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="11">
         <span class="posicao">11o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="12">
         <span class="posicao">12o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="13">
         <span class="posicao">13o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="14">
         <span class="posicao">14o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="15">
         <span class="posicao">15o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="16">
         <span class="posicao">16o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="17">
         <span class="posicao">17o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="18">
         <span class="posicao">18o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="19">
         <span class="posicao">19o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="20">
         <span class="posicao">20o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="21">
         <span class="posicao">21o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="22">
         <span class="posicao">22o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="23">
         <span class="posicao">23o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="24">
         <span class="posicao">24o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="25">
         <span class="posicao">25o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="26">
         <span class="posicao">26o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="27">
         <span class="posicao">27o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="28">
         <span class="posicao">28o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="29">
         <span class="posicao">29o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="30">
         <span class="posicao">30o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="31">
         <span class="posicao">31o</span>
         <span class="grafico-posicao"></span>
      </li>
      <li data-pos="32">
         <span class="posicao">32o</span>
         <span class="grafico-posicao"></span>
      </li>
   </ul>
</div>
<div class="escalacao floater">
   <table class="tabela-escalacao">
      <tbody></tbody>
      <tr class="first odd">
         <td rowspan='2' class="tecnico">
            <div id="thumb-tecnico" class="left">
            </div>
            <div id="nome-tecnico" class="left">
               <p><strong>Téc:</strong><br /> <?php echo $json_data["tecnico"] ?> </p>
            </div>
         </td>
         <?php for($i=0; $i<4; $i++) {
            echo '<td class="eq-'.$i.'">'.$json_data["jogadores"][$i]["nome"].'</td>';
         }
         ?>
      </tr>
      <tr class="even">
         <?php for($j=4; $j<8; $j++) {
            echo '<td class="eq-'.$j.'">'.$json_data["jogadores"][$j]["nome"].'</td>';
         }
         ?>
      </tr>
      <tr class="odd">
         <?php for($k=8; $k<13; $k++) {
            echo '<td class="eq-'.$k.'">'.$json_data["jogadores"][$k]["nome"].'</td>';
         }
         ?>
      </tr>
      <tr class="even">
         <?php for($l=13; $l<18; $l++) {
            echo '<td class="eq-'.$l.'">'.$json_data["jogadores"][$l]["nome"].'</td>';
         }
         ?>
      </tr>
      <tr class="last odd">
         <?php for($m=18; $m<23; $m++) {
            echo '<td class="eq-'.$m.'">'.$json_data["jogadores"][$m]["nome"].'</td>';
         }
         ?>
      </tr>
   </table>
</div>
<div class="dados-copas floater">
   <table class="tabela-dados-copas">
      <tbody>
         <td class="title-curiosidades">
            <div class="container-curiosidade">
               <p>Curiosidades <br/>da seleção</p>
            </div>
         </td>
         <td class="mais-caro">
            <div class="container-curiosidade">
               <div class="thumb-dados-copas left" id="thumb-mais-caro"></div>
               <div class="txt-dados-copas left">
                  <big><?php echo $json_data["mais_caro"] ?></big>
                  <small>R$<?php echo number_format($json_data["valor_mais_caro"], 0, ',', '.'); ?> (o mais valioso)</small>
               </div>
            </div>
         </td>
         <td class="participacoes">
            <div class="container-curiosidade">
               <div class="thumb-dados-copas left" id="thumb-participacoes"></div>
               <div class="txt-dados-copas left">
                  <big><?php echo $json_data["participacao_copas"] ?></big>
                  <small>Participações em mundiais</small>
               </div>
            </div>
         </td>
         <td class="vitorias">
            <div class="container-curiosidade">
               <div class="thumb-dados-copas left" id="thumb-vitorias"></div>
               <div class="txt-dados-copas left">
                  <big><?php echo $json_data["copas_ganhas"] ?></big>
                  <small>vez(es) campeã</small>
               </div>
            </div>
         </td>
      </tbody>
   </table>
</div>
<div class="patrocinadores floater">
   <h3 class="group-title">Patrocinadores</h3>
   <ul id="patrocinadores-" class="lista-patrocinadores inline-list floater">
      <?php foreach($json_data["patrocinadores"] as $patrocinador){
         echo "<li>". $patrocinador["patrocinador"]. "</li>";
       } ?>
   </ul>
</div>
