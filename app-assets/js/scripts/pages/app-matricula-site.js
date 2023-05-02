/*=========================================================================================
    File Name: app-user.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor: Pitter R. Bico
    contato: pitter775@gmail.com / +55 11-94950 6267
==========================================================================================*/
$(function () {
    'use strict';    
    var isRtl = $('html').attr('data-textdirection') === 'rtl';
    var formLinkEmail = $('.form-link-email'); //formulario

    console.log(isRtl);


   if (formLinkEmail.length) {
    formLinkEmail.validate({
        errorClass: 'error',
        rules: {
            'email': { required: true }
        }
    });

    formLinkEmail.on('submit', function (e) {
       e.preventDefault();
       var isValid = formLinkEmail.valid();
       if (isValid) {
          let serealize = formLinkEmail.serializeArray();
          console.log(serealize);

          $.ajax({
             type: "POST",
             url: '/matriculas/link',
             data: serealize,
             success: function (retorno) {
                console.log('submit');
                console.log(retorno);
                enviar_mail(retorno['email'], retorno['tipo-token']);

                
             }
          });
       }
    });
 }

    function enviar_mail(email, token){
        $.ajax({
            type: "GET",
            url: '/enviolink',
            data: {'email':email, 'token':token },
            success: function (retorno) {
               console.log('email enviado!');

       
                //mensagem
                toastr['success']('👋 Enviado o link para o email '+email+'', 'Sucesso!', {
                   closeButton: true,
                   tapToDismiss: true,
                   rtl: isRtl
                });
             

            }
        });
    }

    

    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});
