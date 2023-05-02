/*=========================================================================================
    File Name: app-cardapio.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor:Bico Pitter R. 
    contato: pitter775@gmail.com / 11-9 4950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var dtTableList = $('.cardapio-list-table'); //id da tabela q esta na div  
    var isRtl = $('html').attr('data-textdirection') === 'rtl';
    var newForm = $('.add-new-cardapio'); //formula 
    var modalForm = $('#modalLargo'); //formula 
    var table = false;
    var modalativo = false;

    listCardapio();



    function listCardapio() {
        if (table) {
            table.destroy();
        }
        // Datatable
        if (dtTableList.length) {

            var groupingTable = dtTableList.DataTable({
                //busca uma rota 
                // ajax: assetPath + 'data/cardapio-list.json', // JSON file to add data
                retrieve: true,

                ajax: { url: "/atendimento/all", dataSrc: "" },
                columns: [
                    // columns according to JSON
                    { data: 'id' },
                    { data: 'ate_nome' },
                    { data: 'ate_telefone' },
                    { data: 'ate_tipo' },
                    { data: 'ate_titulo' },
                    {
                        data: function(dados) {
                            if (dados.created_at) {
                                var datef = new Date(dados.created_at);
                                var dataFormatada = datef.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                                return dataFormatada;
                            } else {
                                return null;
                            }

                        }
                    },
                    
                    { data: 'ate_status' }
                ],
                // columnDefs: [{
                //         "targets": [0],
                //         "visible": false,
                //         "searchable": false
                //     }
                // ],
                order: [
                    [2, 'desc']
                ],
                dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-right"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                displayLength: 50,
                lengthMenu: [50, 75, 100],
                language: {
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
                // Buttons with Dropdown
                buttons: [{
                        extend: 'collection',
                        className: 'btn btn-outline-secondary dropdown-toggle mr-2 waves-effect',
                        text: feather.icons['share'].toSvg({ class: 'font-small-4 mr-50 ' }) + 'Export',
                        buttons: [{
                                extend: 'print',
                                text: feather.icons['printer'].toSvg({ class: 'font-small-4 mr-50' }) + 'Print',
                                className: 'dropdown-item',
                                exportOptions: { columns: [0, 1, 2] }
                            },
                            {
                                extend: 'csv',
                                text: feather.icons['file-text'].toSvg({ class: 'font-small-4 mr-50' }) + 'Csv',
                                className: 'dropdown-item',
                                exportOptions: { columns: [0, 1, 2] }
                            },
                            {
                                extend: 'excel',
                                text: feather.icons['file'].toSvg({ class: 'font-small-4 mr-50' }) + 'Excel',
                                className: 'dropdown-item',
                                exportOptions: { columns: [0, 1, 2] }
                            },
                            {
                                extend: 'copy',
                                text: feather.icons['copy'].toSvg({ class: 'font-small-4 mr-50' }) + 'Copy',
                                className: 'dropdown-item',
                                exportOptions: { columns: [0, 1, 2] }
                            }
                        ],
                        init: function(api, node, config) {
                            $(node).removeClass('btn-secondary');
                            $(node).parent().removeClass('btn-group');
                            setTimeout(function() {
                                $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
                            }, 50);
                        }
                    },
                    {
                        text: feather.icons['plus'].toSvg({ class: 'mr-50 font-small-4 ' }) + 'Novo Atendimento',
                        className: 'create-new btn btn-primary waves-effect btnovoatendimento',
                        attr: {
                            'data-toggle': 'modal',
                            'data-target': '#modalLargo'
                        },
                        init: function(api, node, config) {
                            $(node).removeClass('btn-secondary');
                        }
                    }
                ],

                language: {
                    "url": "/app-assets/pt_br.json",
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
                rowCallback: function (row, data) {
                    $(row).addClass('ver_atendimento');
                    $(row).attr('data-toggle', 'modal');
                    $(row).attr('data-target', '#modalLargo');
                    $(row).attr('data-id', data.id);
                }
            });
            setTimeout(function() {
                $('div.head-label').html('<h6 class="mb-0">Listando todos o Atendimentos</h6>');
      
            }, 1000);
            
        }
        table = groupingTable;
    }

    // Form Validation
    if (newForm.length) {
        newForm.validate({
            errorClass: 'error',
            rules: {
                'name': {
                    required: true
                }
            }
        });

        newForm.on('submit', function(e) {

            var isValid = newForm.valid();
            e.preventDefault();
            if (isValid) {
                console.log('valido');
                let serealize = newForm.serializeArray();
      
                $.ajax({
                    type: "POST",
                    url: '/atendimento/cadastro',
                    data: serealize,
                    success: function(data) {
                        if(data == 'ok'){
                            if(!modalativo) {
                                console.log('hide');
                                modalForm.modal('hide');
                            }else{  
                                console.log('abirir');
                                abrirVer($('#com_ate_id').val());                                
                            }
                            
                            toastr['success']('👋 Registro adicionado.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: false,
                                rtl: isRtl
                            });
                            listCardapio();
                        }else{
                            //mensagem
                            toastr['danger']('Não foi possivel registrar esse atendimento.', 'Erro!', {
                                closeButton: true,
                                tapToDismiss: false,
                                rtl: isRtl
                            });
                        }
                    }
                });
            }

        });
    }

    $(document).on('click', '.btnovoatendimento', function() {
        $('#novoAtendimento').html('');
        modalativo = false; 
        $.ajax({
            type: "GET",
            url: '/atendimento/novo',
            data: { "_token": $('meta[name="csrf-token"]').attr('content') },
            success: function(retorno) {
                $('#modal-title').html('Novo Atendimento');
                $('#novoAtendimento').html(retorno);
                $('.novomod').show(); 
                $('.vermod').hide(); 
                
            }
        });
    });


    function abrirEditar(id){
        $('#novoAtendimento').html('');     
        $.ajax({
            type: "GET",
            url: '/atendimento/edit/'+id,
            data: { "_token": $('meta[name="csrf-token"]').attr('content') },
            success: function(retorno) {      
                $('#modal-title').html('Novo Atendimento');
                $('#novoAtendimento').html(retorno);
                $('#com_ate_id').val(id);
                $('.novomod').show(); 
                $('.vermod').hide(); 
            }
        });
    }

    function abrirVer(id){
        console.log(id);
        modalativo = true; 
        $.ajax({
            type: "GET",
            url: '/atendimento/ver/'+id,
            data: { "_token": $('meta[name="csrf-token"]').attr('content') },
            success: function(retorno) {                
                $('#verAtendimento').html(retorno);
                listcomentario(id);                
                $('.vermod').show(); 
                $('.novomod').hide(); 
            }
        });
    }

    
    $(document).on('change', '#ate_status_ver', function() {
        
        let ate_status = $(this).val();  
        let idver = $(this).data('idver');

        console.log(idver);

        $.ajax({
            type: "POST",
            url: '/atendimento/altstatus',
            data: { "_token": $('meta[name="csrf-token"]').attr('content'), 'com_ate_id':idver, 'ate_status':ate_status },
            success: function(data) {
                if(data == 'ok'){
                    if(!modalativo) {
                        console.log('hide');
                        modalForm.modal('hide');
                    }else{  
                        console.log('abirir');
                        abrirVer(idver);                                
                    }
                    
                    toastr['success']('👋 Registro adicionado.', 'Sucesso!', {
                        closeButton: true,
                        tapToDismiss: false,
                        rtl: isRtl
                    });
                    listCardapio();
                }else{
                    //mensagem
                    toastr['danger']('Não foi possivel registrar esse atendimento.', 'Erro!', {
                        closeButton: true,
                        tapToDismiss: false,
                        rtl: isRtl
                    });
                }
            }
        });       
    });

    $(document).on('click', '.btneditar', function() {
        let id = $(this).data('id');  
        abrirEditar(id);        
    });

    $(document).on('click', '.ver_atendimento', function() {
        let id = $(this).data('id'); 
        abrirVer(id)
    });

    $(document).on('keyup', '#com_texto', function(e){  
        if (e.keyCode == 13) {
            e.preventDefault();
            let texto = $('#com_texto').val();
            let idver = $(this).data('idver');

            console.log('texto',texto);
            console.log('idver',idver);
            
            $.ajax({
                type: "POST",
                url: '/atendimento/cadastro_coment',
                data: { "_token": $('meta[name="csrf-token"]').attr('content'), 'com_texto': texto, 'com_ate_id':idver},
                success: function() {
                    listcomentario(idver);     
                    $('#com_texto').val('');            
                }
            });

        }
    });

    function listcomentario(id) {
        $('.divcoments').html('');    
        $.ajax({
            type: "GET",
            url: '/atendimento/comentario/list/'+id,
            data: { "_token": $('meta[name="csrf-token"]').attr('content')},
            success: function(retorno) {
                
                $('.divcoments').html(retorno);                   
            }
        });
    }

    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });

});