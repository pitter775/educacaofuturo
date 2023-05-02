/*=========================================================================================
    File Name: app-cardapio.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor:Bico Pitter R. 
    contato: pitter775@gmail.com / 11-9 4950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var password = true;
    var row_edit = '';
    var confirmText = $('#confirm-text');
    var dtcardapioTable = $('.cardapio-list-table'), //id da tabela q esta na div  
        newcardapioSidebar = $('.new-cardapio-modal'), //name do modal
        isRtl = $('html').attr('data-textdirection') === 'rtl',
        newcardapioForm = $('.add-new-cardapio'); //formula
    var tableCardapio = false;

    var useperfil = $('#use_perfilInput').val();
    var displayno = 'display: none';
    if (useperfil == '10') {
        displayno = '';
    }
    // style="' + displayno + '"


    var data = new Date();

    var dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    $('#alteracao').val(dataFormatada);
    $('#alteracao').trigger('change');

    listCardapio();


    function listCardapio() {
        if (tableCardapio) {
            tableCardapio.destroy();
        }
        // Datatable
        if (dtcardapioTable.length) {

            var groupingTable = dtcardapioTable.DataTable({
                //busca uma rota 
                // ajax: assetPath + 'data/cardapio-list.json', // JSON file to add data
                retrieve: true,

                ajax: { url: "/cardapio/all", dataSrc: "" },
                columns: [
                    // columns according to JSON
                    { data: 'id' },
                    { data: 'car_cardapio' },
                    // { data: 'car_data' },
                    {
                        data: function(dados) {
                            if (dados.car_data) {
                                var datef = new Date(dados.car_data);
                                var dataFormatada = datef.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                                return dataFormatada;
                            } else {
                                return null;
                            }

                        }
                    },
                    { data: 'series_id' },
                    { data: 'ser_nome' },
                    { data: 'ser_periodo' },
                    { data: 'ser_apelido' },
                    { data: '' }
                ],
                columnDefs: [{
                        "targets": [0],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        "targets": [3],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        "targets": [4],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        "targets": [5],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        // For Responsive
                        className: 'control',
                        orderable: false,
                        responsivePriority: 2,
                        targets: 7
                    },
                    {
                        // Actions
                        targets: 7,
                        title: 'Ação',
                        orderable: false,
                        render: function(data, type, full, meta) {
                            // console.log(full);
                            var id = full['id'];
                            var nome = full['car_cardapio'];

                            return (
                                '<a href="javascript:;" class="item-edit delete-record" id="deletar_td" style="' + displayno + '" data-nome="' + nome + '"  data-id="' + id + '" style="color: #f54b20 !important">' +
                                feather.icons['x-circle'].toSvg({ class: 'font-small-4' }) +
                                '</a>'
                            );
                        }
                    }
                ],
                order: [
                    [2, 'desc']
                ],
                dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-right"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                displayLength: 10,
                lengthMenu: [10, 25, 50, 75, 100],
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
                        text: feather.icons['plus'].toSvg({ class: 'mr-50 font-small-4 ' }) + 'Novo Cardápio',
                        className: 'create-new btn btn-primary waves-effect',
                        attr: {
                            'data-toggle': 'modal',
                            'data-target': '#modals-slide-in'
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
            });
            $('div.head-label').html('<h6 class="mb-0">Listando todas as cardapios</h6>');
        }
        tableCardapio = groupingTable;
    }
    // Form Validation
    if (newcardapioForm.length) {
        newcardapioForm.validate({
            errorClass: 'error',
            rules: {
                'name': {
                    required: true
                }
            }
        });

        newcardapioForm.on('submit', function(e) {
            var isValid = newcardapioForm.valid();
            e.preventDefault();
            if (isValid) {
                let serealize = newcardapioForm.serializeArray();
                console.log(serealize);
                $.ajax({
                    type: "POST",
                    url: '/cardapio/cadastro',
                    data: serealize,
                    success: function(data) {
                        addnovalinha(serealize, data);
                        newcardapioSidebar.modal('hide');
                    }
                });
            }
        });
    }

    function editarlinha(serealize, data) {
        $(row_edit).addClass('alteraressatr');
        //  var rowData = dtcardapioTable.DataTable().row($('.alteraressatr')).data();  //mostra todos os dados dessa tr;
        console.log('editar linha');
        console.log(serealize);
        dtcardapioTable.DataTable().row($('.alteraressatr')).data({
            "id": serealize[1]['value'],
            "ser_escolas_id": serealize[2]['value'],
            "ser_nome": serealize[3]['value'],
            "ser_apelido": serealize[4]['value'],
            "ser_periodo": serealize[5]['value'],
            "": ""
        }).draw();

        $(row_edit).css('background-color', '#749efe');
        $(row_edit).css('color', '#fff');
        $(row_edit).animate({
            color: "#555",
            backgroundColor: 'transparent'
        }, 1000, "linear");
        $(row_edit).removeClass('alteraressatr');
        //mensagem
        toastr['success']('👋 Arquivo alterado.', 'Sucesso!', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
        });
    }

    function addnovalinha(serealize, data) {
        console.log('addlinha');
        listCardapio();
    }
    $(document).on('change', '#series_id', function() {
        let val = $(this).text();
        console.log(val)
    });
    $(document).on('click', '.create-new', function() {
        $("#senha").prop('required', true);
        $(".ediadi").text('Adicionar');
        $("#senhalabel").text('Senha');
        $('#id_geral').val('');
        $('#name').val('');
    });
    $(document).on('click', '#editar_td', function() {
        $("#senha").prop('required', false);
        $(".ediadi").text('Editar');
        $("#senhalabel").text('Nova Senha');

        $('#id_geral').val($(this).data('id'));
        $('#ser_escolas_id').val($(this).data('ser_escolas_id'));
        $('#ser_apelido').val($(this).data('ser_apelido'));
        $('#ser_periodo').val($(this).data('ser_periodo'));
        $('#ser_nome').val($(this).data('ser_nome'));
        row_edit = dtcardapioTable.DataTable().row($(this).parents('tr')).node();
    });
    $(document).on('click', '#deletar_td', function() {
        var t = dtcardapioTable.DataTable();
        var row = dtcardapioTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Cardápio',
            text: $(this).data('nome') + '?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, pode deletar!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
        }).then(function(result) {
            if (result.value) {
                $.get('/cardapio/delete/' + id, function(retorno) {
                    if (retorno == 'Erro') {
                        //mensagem
                        toastr['danger']('👋 Arquivo comprometido, não pode excluir.', 'Erro!', {
                            closeButton: true,
                            tapToDismiss: false,
                            rtl: isRtl
                        });
                    } else {
                        //animação de saida
                        $(row).css('background-color', '#fe7474');
                        $(row).css('color', '#fff');
                        $(row).animate({
                            opacity: 0,
                            left: "0",
                            backgroundColor: '#c74747'
                        }, 1000, "linear", function() {
                            var linha = $(this).closest('tr');
                            t.row(linha).remove().draw()
                        });
                        // mensagem info
                        toastr['success']('👋 Arquivo Removido.', 'Sucesso!', {
                            closeButton: true,
                            tapToDismiss: false,
                            rtl: isRtl
                        });

                    }
                });
            }
        });


    });

    function contaChamada() {
        let presenca = 0;
        let falta = 0;

        $(".cardcardapio ").each(function() {
            if ($(this).hasClass("divpresente")) {
                presenca = presenca + 1;
            }
            if ($(this).hasClass("divfalta")) {
                falta = falta + 1;
            }
        });

        $('.sppresente').text(presenca);
        $('.spfalta').text(falta);


    }
    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });

});