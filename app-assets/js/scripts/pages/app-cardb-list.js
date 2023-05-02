/*=========================================================================================
    File Name: app-publicacao.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor: Pitter R. Bico
    contato: pitter775@gmail.com / 11-9 4950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var isRtl = $('html').attr('data-textdirection') === 'rtl';

    console.log('dfadsfsa');
    let id = $('#iduser').val();

    
    var tableCardapio = false;

    var telefone = $('#telresp').val();

    if(telefone == ''){
        alert('Aluno sem número de telefone.');
        telefone = false;
    }else{
        telefone.replace('-', ''); 
        telefone.replace('(', ''); 
        telefone.replace(')', ''); 
        telefone.replace(' ', ''); 
    }

    //Verifica se o botao de entrada vai ficar ativo
    $.get('/usuario/card/entrada/bt/' + id, function(retorno) {
        if(retorno == 0){
            $('.btentrada').prop("disabled",true);
        }       
    });

    $.get('/usuario/card/saida/bt/' + id, function(retorno) {
        if(retorno == 0){
            $('.btsaida').prop("disabled",true);
        }       
    });



    $(document).on('click', '.btentrada ', function() {    
        
        let nome = $(this).data('nome');
        let serid = $(this).data('serid');
        let sername = $(this).data('sername');
        console.log('btentrada');
        $.ajax({
            type: "POST",
            url: '/usuario/card/entrad',
            data: { "_token": $('meta[name="csrf-token"]').attr('content'), 
                id: id, 
                nome: nome, 
                serid: serid 
            },
            success: function(data) {
                console.log(data);
                if(data == 'ok'){   
                    if(telefone) {            
                        window.open('sms:'+telefone+'?body=Olá! '+nome +', da turma '+sername+', esta entrando na escola. 🥰', '_blank');
                    }
                    $('.btentrada').prop("disabled",true);
                }
            }
        });
    });

    $(document).on('click', '.btsaida ', function() {    
        
        let nome = $(this).data('nome');
        let serid = $(this).data('serid');
        let sername = $(this).data('sername');
        $.ajax({
            type: "POST",
            url: '/usuario/card/said',
            data: { "_token": $('meta[name="csrf-token"]').attr('content'), 
                id: id, 
                nome: nome, 
                serid: serid 
            },
            success: function(data) {
                if(data == 'ok'){    
                    if(telefone) {
                        window.open('sms:'+telefone+'?body=Olá! '+nome +', da turma '+sername+', esta saindo da escola. 🥰', '_blank');
                    }          
                    $('.btsaida').prop("disabled",true);
                }
            }
        });        
    });


    

    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });

});