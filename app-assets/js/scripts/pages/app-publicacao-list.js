/*=========================================================================================
    File Name: app-publicacao.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor: Pitter R. Bico
    contato: pitter775@gmail.com / 11-9 4950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var password = true;
    var numale = true
    var row_edit = '';
    var confirmText = $('#confirm-text');
    var dtpublicacaoTable = $('.publicacao-list-table'), //id da tabela q esta na div  
        newpublicacaoSidebar = $('.new-publicacao-modal'), //name do modal
        isRtl = $('html').attr('data-textdirection') === 'rtl',
        newpublicacaoForm = $('.add-new-publicacao'); //formula
        var tablePub = false;

    var useperfil = $('#use_perfilInput').val();
    var displayno = 'display: none';
    if (useperfil == '10') {
        displayno = '';
    }

    datatablepub();

    function datatablepub(){
        console.log('datatablepub');
        if (tablePub) {
            tablePub.destroy();
            console.log('destroy');
        }
    // Datatable
    if (dtpublicacaoTable.length) {
        var groupingTable = dtpublicacaoTable.DataTable({
            retrieve: true,
            //busca uma rota 
            // ajax: assetPath + 'data/publicacao-list.json', // JSON file to add data
            ajax: { url: "/publicacao/all", dataSrc: "" },
            columns: [
                // columns according to JSON
                { data: 'id' },
                { data: 'pub_tipo' },
                { data: 'pub_titulo' },
                {
                    data: function(dados) {
                        return limparHTML(dados.pub_texto).substr(0, 150);
                    }
                },
                { data: '' }
            ],
            columnDefs: [{
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                },
                {
                    // For Responsive
                    className: 'control',
                    orderable: false,
                    responsivePriority: 2,
                    targets: 4
                },
                {
                    // Actions
                    targets: 4,
                    title: 'Ação',
                    orderable: false,
                    render: function(data, type, full, meta) {
                        var $id = full['id'],
                            $ser_nome = full['pub_titulo'];

                        return (
                            '<div class="btn-group">' +
                            '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                            feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                            '</a>' +
                            '<div class="dropdown-menu dropdown-menu-right">' +
                       
                            '<a data-name="' + $ser_nome + '" data-id="' + $id + '" data-ser_nome="' + $ser_nome + '" ' +
                            'class="dropdown-item" data-toggle="modal" data-target="#modals-slide-in" id="editar_td">' + feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' }) + 'Editar</a>' +
                            '<a href="javascript:;" data-name="' + $ser_nome + '" class="dropdown-item delete-record" style="' + displayno + '" data-id="' + $id + '"  id="deletar_td">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + 'Deletar</a></div>' +
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
                    text: feather.icons['plus'].toSvg({ class: 'mr-50 font-small-4 ' }) + 'Nova Publicação',
                    className: 'create-new btn btn-primary waves-effect',
                    attr: {
                        'data-toggle': 'modal',
                        'data-target': '#xlarge'
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
        setTimeout(function() {
            $('div.head-label').html('<h6 class="mb-0">Listando todas as publicações</h6>');
        }, 1000);

    }
    tablePub = groupingTable;
    }



    $(document).on('click', '.btsalvarpublicacao', function() {
        tinymce.triggerSave();
        let pub_texto = $('#mytextarea').val();
        let pub_titulo = $('#pub_titulo').val();
        let pub_tipo = $('#pub_tipo').val();
        let pub_status = $('#pub_status').val();
        let pub_codigo = $('#inputcodigo').val();

        let dados = {
            pub_texto: pub_texto,
            pub_titulo: pub_titulo,
            pub_tipo: pub_tipo,
            pub_status: pub_status,
            pub_codigo: pub_codigo
        }

        $.ajax({
            type: "POST",
            url: '/publicacao/cadastro',
            data: dados,
            success: function(data) {

                datatablepub();

                toastr['success']('👋 Arquivo Criado.', 'Sucesso!', {
                    closeButton: true,
                    tapToDismiss: false,
                    rtl: isRtl
                });
            }
        });
    });


    $.get('/publicacao/editar/0', function(retorno) {
        $('#gerePub').html(retorno);
        
    });

    $(document).on('click', '.create-new', function() {
        console.log('create');
        tinyMCE.remove();

        $('.full-editor').remove();

        $.get('/publicacao/editar/0', function(retorno) {
            $('#gerePub').html(retorno);
            numero_aleatorio();
            datatablepub();
        });
    });

    $(document).on('click', '#novoEditor', function() {
        let id = null;
        $.get('/publicacao/editar/' + id, function(retorno) {
            $('#gerePub').html(retorno);
        });
    });
    $(document).on('click', '#editar_td', function() {
        tinyMCE.remove();
        $('.full-editor').remove();
        let id = $(this).data('id');
        $.get('/publicacao/editar/' + id, function(retorno) {
            $('#gerePub').html(retorno);
            datatablepub();
            toastr['success']('👋 Arquivo Editado.', 'Sucesso!', {
                closeButton: true,
                tapToDismiss: false,
                rtl: isRtl
            });

        });
    });

    $(document).on('click', '#deletar_td', function() {
        var t = dtpublicacaoTable.DataTable();
        var row = dtpublicacaoTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Publicação',
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
                $.get('/publicacao/delete/' + id, function(retorno) {
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

    function limparHTML(html) {
        const proxy = document.createElement('div');
        proxy.innerHTML = html;
        return proxy.innerText;
    }

    var numeros = [];
    var codigo = '';


    function numero_aleatorio() {
        while (numeros.length < 16) {
            var aleatorio = Math.floor(Math.random() * 100);

            if (numeros.indexOf(aleatorio) == -1)
                numeros.push(aleatorio);
            codigo = codigo + aleatorio;
        }
        $('#inputcodigo').val(codigo);
    }

    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });

});