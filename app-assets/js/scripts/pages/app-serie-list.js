/*=========================================================================================
    File Name: app-serie.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor: Pitter R. Bico
    contato: pitter775@gmail.com / 11-9 4950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var password = true;
    var row_edit = '';
    var confirmText = $('#confirm-text');
    var dtserieTable = $('.serie-list-table'), //id da tabela q esta na div  
        newserieSidebar = $('.new-serie-modal'), //name do modal
        isRtl = $('html').attr('data-textdirection') === 'rtl',
        newserieForm = $('.add-new-serie'); //formula

    var useperfil = $('#use_perfilInput').val();
    var displayno = 'display: none';
    if (useperfil == '10') {
        displayno = '';
    }
    // style="' + displayno + '"

    // Datatable
    if (dtserieTable.length) {
        dtserieTable.DataTable({
            //busca uma rota 
            // ajax: assetPath + 'data/serie-list.json', // JSON file to add data
            ajax: { url: "/serie/all", dataSrc: "" },
            columns: [
                // columns according to JSON
                { data: 'id' },
                { data: 'ser_escolas_id' },
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
                    "targets": [1],
                    "visible": false,
                    "searchable": false
                },
                {
                    // For Responsive
                    className: 'control',
                    orderable: false,
                    responsivePriority: 2,
                    targets: 5
                },
                {
                    // Actions
                    targets: 5,
                    title: 'Ação',
                    orderable: false,
                    render: function(data, type, full, meta) {
                        console.log(full);
                        var $id = full['id'],
                            $ser_escolas_id = full['ser_escolas_id'],
                            $ser_nome = full['ser_nome'],
                            $ser_periodo = full['ser_periodo'],
                            $ser_apelido = full['ser_apelido'];

                        return (
                            '<div class="btn-group">' +
                            '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                            feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                            '</a>' +
                            '<div class="dropdown-menu dropdown-menu-right">' +
                            '<a class="dropdown-item">' + feather.icons['file-text'].toSvg({ class: 'font-small-4 mr-50' }) + 'Detalhes</a>' +
                            '<a data-ser_nome="' + $ser_nome + '" data-id="' + $id + '" data-ser_escolas_id="' + $ser_escolas_id + '" data-ser_nome="' + $ser_nome + '" data-ser_periodo="' + $ser_periodo + '" data-ser_apelido="' + $ser_apelido + '"     ' +
                            'class="dropdown-item" data-toggle="modal" data-target="#modals-slide-in" id="editar_td">' + feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' }) + 'Editar</a>' +
                            '<a href="javascript:;" class="dropdown-item delete-record" style="' + displayno + '" data-id="' + $id + '"  id="deletar_td">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + 'Deletar</a></div>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                }
            ],
            order: [
                [1, 'asc']
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
                    text: feather.icons['plus'].toSvg({ class: 'mr-50 font-small-4 ' }) + 'Nova Série',
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
        $('div.head-label').html('<h6 class="mb-0">Listando todas as series</h6>');
    }
    // Form Validation
    if (newserieForm.length) {
        newserieForm.validate({
            errorClass: 'error',
            rules: {
                'name': {
                    required: true
                }
            }
        });

        newserieForm.on('submit', function(e) {
            var isValid = newserieForm.valid();
            e.preventDefault();
            if (isValid) {
                let serealize = newserieForm.serializeArray();
                console.log(serealize);
                $.ajax({
                    type: "POST",
                    url: '/serie/cadastro',
                    data: serealize,
                    success: function(data) {
                        var result = data.split(',');
                        if (result[0] == 'Erro') {} else {
                            if (data == 'editado') {
                                editarlinha(serealize, data);
                            } else {
                                addnovalinha(serealize, data);
                            }
                            newserieSidebar.modal('hide');
                        }
                    }
                });
            }
        });
    }

    function editarlinha(serealize, data) {
        $(row_edit).addClass('alteraressatr');
        //  var rowData = dtserieTable.DataTable().row($('.alteraressatr')).data();  //mostra todos os dados dessa tr;
        console.log('editar linha');
        console.log(serealize);
        dtserieTable.DataTable().row($('.alteraressatr')).data({
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
        var t = dtserieTable.DataTable();
        console.log('novalinha');
        console.log(data);

        var rowNode = t.row.add({
            "id": data,
            "ser_escolas_id": ser_escolas_id,
            "ser_nome": serealize[3]['value'],
            "ser_periodo": serealize[5]['value'],
            "ser_apelido": serealize[4]['value'],
            "": ""
        }).draw().node();

        $(rowNode).css('opacity', '0');
        $(rowNode).css('background-color', '#71c754');
        $(rowNode).animate({
            opacity: 1,
            left: "0",
            backgroundColor: '#fff'
        }, 1000, "linear");
    }
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
        row_edit = dtserieTable.DataTable().row($(this).parents('tr')).node();
    });
    $(document).on('click', '#deletar_td', function() {
        var t = dtserieTable.DataTable();
        var row = dtserieTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Séries',
            text: $(this).data('name') + '?',
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
                $.get('/serie/delete/' + id, function(retorno) {
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
    $(document).on('click', '.bt-presente ', function() {
        console.log('presente', $(this).data('userid'));
        let btclick = $(this);
        btclick.parents('div').eq(2).addClass('divpresente');
        btclick.parents('div').eq(2).removeClass('divfalta');
        $.ajax({
            type: "POST",
            url: '/presenca/cadastro',
            data: { "_token": $('meta[name="csrf-token"]').attr('content'), iduser: $(this).data('userid'), datanaw: $(this).data('datanaw'), tipo: '1' },
            success: function(data) {

                console.log(data['cadastro']);
                console.log(data['cadastro-1']);
                contaChamada();
            }
        });
    });
    $(document).on('click', '.bt-falta', function() {
        console.log('falta');
        let btclick = $(this);
        btclick.parents('div').eq(2).addClass('divfalta');
        btclick.parents('div').eq(2).removeClass('divpresente');
        $.ajax({
            type: "POST",
            url: '/presenca/cadastro',
            data: { iduser: $(this).data('userid'), datanaw: $(this).data('datanaw'), tipo: '0', "_token": $('meta[name="csrf-token"]').attr('content') },
            success: function(data) {

                console.log(data['cadastro']);
                console.log(data['cadastro-1']);
                contaChamada();
            }
        });
    });

    function contaChamada() {
        let presenca = 0;
        let falta = 0;

        $(".cardserie ").each(function() {
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