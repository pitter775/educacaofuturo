/*=========================================================================================
    File Name: app-dash.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor: Pitter R. Bico
    contato: pitter775@gmail.com / 11-9 4950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var formPiloto = $('#form-piloto'); //formulario
    var isRtl = $('html').attr('data-textdirection') === 'rtl';

    var tableCardapio = false;
    console.log('piloto');
    var data = new Date();
    var mesatual = data.getMonth();
    var mesatual = mesatual + 1;
    var dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    $('#dt_final').val(dataFormatada);
    $('#dt_final').trigger('change');

    var dt_inicial = $('#dt_inicial').val();
    var dt_final = $('#dt_final').val();
    totais(dt_inicial, dt_final);



    function listPiloto() {

        if (tableCardapio) {
            tableCardapio.destroy();
        }

        var dtcardapioTable = $('.piloto-list-table'); //id da tabela q esta na div  

        var numColum = dtcardapioTable.data('colum');
        console.log('qntcolum', numColum);
        const arrayColum = [];


        for (let i = 0; i < numColum; i++) {
            arrayColum.push(i);
        }



        // Datatable
        if (dtcardapioTable.length) {

            var groupingTable = dtcardapioTable.DataTable({
                //busca uma rota 
                // ajax: assetPath + 'data/cardapio-list.json', // JSON file to add data
                retrieve: true,
                order: [
                    [0, 'asc']
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
                                exportOptions: { columns: arrayColum }
                            },
                            {
                                extend: 'csv',
                                text: feather.icons['file-text'].toSvg({ class: 'font-small-4 mr-50' }) + 'Csv',
                                className: 'dropdown-item',
                                exportOptions: { columns: arrayColum }
                            },
                            {
                                extend: 'excel',
                                text: feather.icons['file'].toSvg({ class: 'font-small-4 mr-50' }) + 'Excel',
                                className: 'dropdown-item',
                                exportOptions: { columns: arrayColum }
                            },
                            {
                                extend: 'copy',
                                text: feather.icons['copy'].toSvg({ class: 'font-small-4 mr-50' }) + 'Copy',
                                className: 'dropdown-item',
                                exportOptions: { columns: arrayColum }
                            }
                        ],
                        init: function(api, node, config) {
                            $(node).removeClass('btn-secondary');
                            $(node).parent().removeClass('btn-group');
                            setTimeout(function() {
                                $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
                            }, 50);
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
                $('div.head-label').html('<h6 class="mb-0">Listando os campos selecionados</h6>');
                console.log('foi');
            }, 1000);
            
        }
        tableCardapio = groupingTable;
    }

    $('.btmodal').on('click', function (e) {
        $('#tabela-piloto').html('Carregando...');
        var dados = [];
        dados.push({name: "_token", value: $('meta[name="csrf-token"]').attr('content')});

        let parametros = $(this).data('campo');
        let condicao = $(this).data('condicao');
        let titulo = $(this).data('titulo');
        let condicaodetalhada = $(this).data('condicaodetalhada');
        dados.push({name: 'condicao', value: condicao});
        dados.push({name: 'titulo', value: titulo});
        dados.push({name: 'condicaodetalhada', value: condicaodetalhada});
        
        let parametross = parametros.split(";");
        parametross.forEach(function(parametro, i) {
            let campos = parametro.split("-");
            dados.push({name: campos[0], value: campos[1]});
        })

        console.log(dados);
        
        $.ajax({
            type: "POST",
            url: '/piloto/tabelaDash',
            data: $.param(dados),
            success: function(data) {
                // console.log(data);
                $('#tabela-piloto').html(data);
                setTimeout(() => {
                    listPiloto();
                }, "2000");
            }
        });
    });

    function totais(dt_inicial, dt_final) {
        $.ajax({
            type: "POST",
            url: '/presenca/totais',
            data: {
                "_token": $('meta[name="csrf-token"]').attr('content'),
                'dt_final': dt_final,
                'dt_inicial': dt_inicial
            },
            success: function(data) {
                console.log('resultado');
                console.log(data);
                let totaldealunos = $('#inptotalalunos').val();
                let totalregistrados = parseInt(data.presentes[0]['total'] + data.faltas[0]['total']);
                let naoregistrados = parseInt(totaldealunos - totalregistrados);

                console.log(naoregistrados);

                $('#ppresente').html(data.presentes[0]['total']);
                $('#ffaltantes').html(data.faltas[0]['total']);
                $('#rregistrados').html(totalregistrados);
                $('#naoregistrados').html(naoregistrados);

            }
        });
    }
});