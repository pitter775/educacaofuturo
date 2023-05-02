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
    var dtseriesTable = $('.serie-list-table'); //id da tabela q esta na div  
    var dtclasseTable = $('.classe-list-table');

    var isRtl = $('html').attr('data-textdirection') === 'rtl';
    var tableSeries = false;
    var tableClasse = false;

    var tdiasuteis = 1;
''
    var data = new Date();
    var mesatual = data.getMonth();
    var mesatual = mesatual + 1;
    var dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    dataFormatada = dataFormatada.split('/').join('-');

    console.log(dataFormatada);

    $('#dt_final').val(dataFormatada);
    $('#dt_final').trigger('change');

    var dt_inicial = $('#dt_inicial').val();
    var dt_final = $('#dt_final').val();
    totais(dt_inicial, dt_final);
    series(dt_inicial, dt_final);
    var serieativo = $("#mat_series_id option:selected").val();
    $('.divporClasse').hide();

    var $browserStateChartPrimary = document.querySelector('#browser-state-chart-primary');



    // $("#mat_mes_id select").val(mesatual + 1).change();

    $('#mat_mes_id option[value=' + mesatual + ']').attr('selected', 'selected');

    function stringNumber(params) {
        if (params) {
            var inteiro = parseInt(params);
            return inteiro;
        } else {
            return null;
        }
    }


    getDataGrafico(mesatual, serieativo);
    var dias = [];
    var faltas = [];
    var presencas = [];

    function listSeriesTab(datajson) {
        //datajson = JSON.stringify(datajson);

        if (tableSeries) {
            tableSeries.destroy();
        }
        // Datatable
        if (dtseriesTable.length) {

            var groupingTable = dtseriesTable.DataTable({
                //busca uma rota 
                // ajax: assetPath + 'data/cardapio-list.json', // JSON file to add data
                retrieve: true,

                data: datajson,
                columns: [
                    // columns according to JSON
                    { data: 'id' },
                    { data: 'serie' },
                    { data: 'idserie' },
                    { data: 'professora' },
                    {
                        data: function(dados) {
                            return dt_inicial;
                        }
                    },
                    {
                        data: function(dados) {
                            return dt_final;
                        }
                    },
                    {
                        data: function(dados) {
                            return stringNumber(dados.falta);
                        }
                    },
                    {
                        data: function(dados) {
                            return stringNumber(dados.presente);
                        }
                    },
                    
                    {
                        data: function(dados) {
                            return stringNumber(dados.total);
                        }
                    },
                    {
                        data: function(dados) {
                            let x100 = dados.presente * 100;
                            let porcent = x100/dados.totseries;
                            
                            let tot = porcent/tdiasuteis;
                            return tot.toFixed(1);
                        }
                    },
                    { data: '' }
                ],
                columnDefs: [{
                        "targets": [0, 2, 4, 5],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        // For Responsive
                        className: 'control',
                        orderable: false,
                        responsivePriority: 2,
                        targets: 10
                    },
                    {
                        // Actions
                        targets: 10,
                        title: 'Ação',
                        orderable: false,
                        render: function(data, type, full, meta) {
                            // console.log(full);
                            var id = full['id'];
                            var idserie = full['idserie'];

                            return (
                                '<a href="javascript:;" class="item-edit" id="open_serie" data-idserie="' + idserie + '"  data-id="' + id + '" style="color: #154778 !important">' +
                                feather.icons['eye'].toSvg({ class: 'font-small-4' }) +
                                '</a>'
                            );
                        }
                    }
                ],
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
                    className: 'btn btn-outline-secondary dropdown-toggle  waves-effect',
                    text: feather.icons['share'].toSvg({ class: 'font-small-4 mr-50 ' }) + 'Export',
                    buttons: [{
                            extend: 'print',
                            text: feather.icons['printer'].toSvg({ class: 'font-small-4 mr-50' }) + 'Print',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 3, 4, 5, 6, 7, 8, 9] }
                        },
                        {
                            extend: 'csv',
                            text: feather.icons['file-text'].toSvg({ class: 'font-small-4 mr-50' }) + 'Csv',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 3, 4, 5, 6, 7, 8, 9] }
                        },
                        {
                            extend: 'excel',
                            text: feather.icons['file'].toSvg({ class: 'font-small-4 mr-50' }) + 'Excel',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 3, 4, 5, 6, 7, 8, 9] }
                        },
                        {
                            extend: 'copy',
                            text: feather.icons['copy'].toSvg({ class: 'font-small-4 mr-50' }) + 'Copy',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 3, 4, 5, 6, 7, 8, 9] }
                        }
                    ],
                    init: function(api, node, config) {
                        $(node).removeClass('btn-secondary');
                        $(node).parent().removeClass('btn-group');
                        setTimeout(function() {
                            $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
                        }, 50);
                    }
                }],

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
                $('div.head-label').html('<h6 class="mb-0">Listando as Salas</h6>');
      
            }, 1000);
        }
        tableSeries = groupingTable;
    }


    function listClasseTab(datajson) {
        //datajson = JSON.stringify(datajson);

        if (tableClasse) {
            tableClasse.destroy();
        }
        // Datatable
        if (dtclasseTable.length) {

            var groupingTable = dtclasseTable.DataTable({
                //busca uma rota 
                // ajax: assetPath + 'data/cardapio-list.json', // JSON file to add data
                retrieve: true,

                data: datajson,
                columns: [
                    // columns according to JSON
                    { data: 'id' },
                    { data: 'serie' },
                    { data: 'aluno' },
                    {
                        data: function(dados) {
                            return dt_inicial;
                        }
                    },
                    {
                        data: function(dados) {
                            return dt_final;
                        }
                    },
                    {
                        data: function(dados) {
                            return stringNumber(dados.falta);
                        }
                    },
                    {
                        data: function(dados) {
                            return stringNumber(dados.presente);
                        }
                    },
                ],
                columnDefs: [{
                    "targets": [0, 1, 3, 4],
                    "visible": false,
                    "searchable": false
                }],
                order: [
                    [3, 'desc']
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
                    className: 'btn btn-outline-secondary dropdown-toggle  waves-effect',
                    text: feather.icons['share'].toSvg({ class: 'font-small-4 mr-50 ' }) + 'Export',
                    buttons: [{
                            extend: 'print',
                            text: feather.icons['printer'].toSvg({ class: 'font-small-4 mr-50' }) + 'Print',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 2, 3, 4, 5, 6] }
                        },
                        {
                            extend: 'csv',
                            text: feather.icons['file-text'].toSvg({ class: 'font-small-4 mr-50' }) + 'Csv',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 2, 3, 4, 5, 6] }
                        },
                        {
                            extend: 'excel',
                            text: feather.icons['file'].toSvg({ class: 'font-small-4 mr-50' }) + 'Excel',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 2, 3, 4, 5, 6] }
                        },
                        {
                            extend: 'copy',
                            text: feather.icons['copy'].toSvg({ class: 'font-small-4 mr-50' }) + 'Copy',
                            className: 'dropdown-item',
                            exportOptions: { columns: [1, 2, 3, 4, 5, 6] }
                        }
                    ],
                    init: function(api, node, config) {
                        $(node).removeClass('btn-secondary');
                        $(node).parent().removeClass('btn-group');
                        setTimeout(function() {
                            $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
                        }, 50);
                    }
                }],

                language: {
                    "url": "/app-assets/pt_br.json",
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
            });
            // $('div.head-label').html('<h6 class="mb-0">Listando as presenças por classe</h6>');
        }
        tableClasse = groupingTable;
    }

    function editarlinha(serealize, data) {
        $(row_edit).addClass('alteraressatr');
        //  var rowData = dtserieTable.DataTable().row($('.alteraressatr')).data();  //mostra todos os dados dessa tr;
        console.log('editar linha');
        console.log(serealize);
        dtserieTable.DataTable().row($('.alteraressatr')).data({
            "id": serealize[1]['value'],
            "ser_escolas_id": serealize[2]['value'],
            "ser_apelido": serealize[3]['value'],
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

    $(document).on('change', '#dt_final', function() {
        dt_inicial = $('#dt_inicial').val();
        dt_final = $('#dt_final').val();

        let data_brasileira2 = dt_inicial;
        let data_americana2 = data_brasileira2.split('-').reverse().join('-');

        let data_brasileira = dt_final;
        let data_americana = data_brasileira.split('-').reverse().join('-');

        tdiasuteis = getnumDiasUteis(data_americana2, data_americana);


        totais(dt_inicial, dt_final);
        series(dt_inicial, dt_final);
        $('.divporClasse').hide();

        console.log(getnumDiasUteis('2021-01-01', '2021-12-31'));
    });
    $(document).on('change', '#dt_inicial', function() {
        dt_inicial = $('#dt_inicial').val();
        dt_final = $('#dt_final').val();

        let data_brasileira2 = dt_inicial;
        let data_americana2 = data_brasileira2.split('-').reverse().join('-');

        let data_brasileira = dt_final;
        let data_americana = data_brasileira.split('-').reverse().join('-');

        tdiasuteis = getnumDiasUteis(data_americana2, data_americana);


        totais(dt_inicial, dt_final);
        series(dt_inicial, dt_final);
        $('.divporClasse').hide();

 

       

        




        //console.log(getnumDiasUteis('04-10-2022', '2022-12-31'));
   
    });
    $(document).on('click', '#open_serie', function() {
        $('.divporClasse').show();

        let idseries = $(this).data('idserie');
        console.log(idseries);
        $.ajax({
            type: "GET",
            url: '/presenca/seriesid',
            data: {
                "_token": $('meta[name="csrf-token"]').attr('content'),
                'dt_final': dt_final,
                'dt_inicial': dt_inicial,
                'idserie': idseries
            },
            success: function(data) {
                console.log('listando...');
                // console.log(data);
                listClasseTab(data);

            }
        });
    });
    $(document).on('change', '#mat_mes_id', function() {
        var mes = $("#mat_mes_id option:selected").val();
        var serie = $("#mat_series_id option:selected").val();
        getDataGrafico(mes, serie);
    });
    $(document).on('change', '#mat_series_id', function() {
        var mes = $("#mat_mes_id option:selected").val();
        var serie = $("#mat_series_id option:selected").val();
        getDataGrafico(mes, serie);
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
                $('#totalpresentes').html(data.presentes[0]['total']);
                $('#totalfaltas').html(data.faltas[0]['total']);
                $('#totalOcorrencias').html(data.total[0]['total']);
                $('#totalAlunos').html(data.alunos);

            }
        });
    }

    function series(dt_inicial, dt_final) {


        $.ajax({
            type: "GET",
            url: '/presenca/series',
            data: {
                "_token": $('meta[name="csrf-token"]').attr('content'),
                'dt_final': dt_final,
                'dt_inicial': dt_inicial
            },
            success: function(data) {
                console.log('listando...');
            
                listSeriesTab(data);

            }
        });
    }

    function getDataGrafico(mes, serie) {
        $.ajax({
            type: "GET",
            url: '/presenca/getDataGrafico',
            data: {
                "_token": $('meta[name="csrf-token"]').attr('content'),
                'mes': mes,
                'serie': serie
            },
            success: function(data) {
                dias = [];
                faltas = [];
                presencas = [];
                $('#line-area-chart').html('');
                data.forEach(separardadosgrafico);
                graficoMensal()

            }
        });
    }


    function separardadosgrafico(element) {
        dias.push(element['pres_datanaw']);
        faltas.push(element['falta']);
        presencas.push(element['presente']);
    }

    function graficoMensal() {

        // console.log(dias);
        // Area Chart - grafico mensal de presenças
        // --------------------------------------------------------------------

        var areaChartEl = document.querySelector('#line-area-chart'),
            areaChartConfig = {
                chart: {
                    height: 400,
                    type: 'area',
                    parentHeightOffset: 0,
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: false,
                    curve: 'straight'
                },
                legend: {
                    show: true,
                    position: 'top',
                    horizontalAlign: 'start'
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                colors: ['rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
                series: [{
                        name: 'Presenças',
                        data: presencas
                    },
                    {
                        name: 'Faltas',
                        data: faltas
                    }
                ],
                xaxis: {
                    categories: dias
                },
                fill: {
                    opacity: 1,
                    type: 'solid'
                },
                tooltip: {
                    shared: false
                },
                yaxis: {
                    opposite: isRtl
                }
            };
        if (typeof areaChartEl !== undefined && areaChartEl !== null) {
            var areaChart = new ApexCharts(areaChartEl, areaChartConfig);
            areaChart.render();
        }
    }

    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });


    function DataAdicionar(data_informada, quantidade) {
        var fator = 24 * 60 * 60 * 1000;
        var nova_data = new Date(data_informada.getTime() + quantidade * fator);
        nova_data.setHours(0,0,0,0);
        return nova_data;
    }
      
    function DataSubtrair(data_informada, quantidade) {
        var fator = 24 * 60 * 60 * 1000;
        var nova_data = new Date(data_informada.getTime() - quantidade * fator);
        nova_data.setHours(0,0,0,0);
        return nova_data;
    }
    function FeriadosFixos(ano){
        var resultados = [];
        //Array de datas no formato mes/dia.
        //OBS: O primeiro mes é 0 e o último mes é 11
        var datas = [[0,  1], [3,  21],[4,  1], [8,  7], [9,  12], [10,  2], [10, 15], [11, 25]];
        for (var z = 0; z < datas.length; z++){
            resultados.push(new Date(ano, datas[z][0],  datas[z][1]).getTime());
        }
        return resultados;
    }
      
      function Pascoa(Y) {
          var C = Math.floor(Y/100);
          var N = Y - 19*Math.floor(Y/19);
          var K = Math.floor((C - 17)/25);
          var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
          I = I - 30*Math.floor((I/30));
          I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
          var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
          J = J - 7*Math.floor(J/7);
          var L = I - J;
          var M = 3 + Math.floor((L + 40)/44);
          var D = L + 28 - 31*Math.floor(M/4);
          return new Date(Y, M, D);
      }
      
      function getnumDiasUteis(startDate, dataFinal) {
          var numDiasUteis = 0;
        var arr1 = startDate.split('-');
        var arr2 = dataFinal.split('-');
        var dataAtual = new Date(arr1[0],arr1[1]-1, arr1[2]);
        dataFinal = new Date(arr2[0],arr2[1]-1, arr2[2]);
        var ano_inicial = dataAtual.getFullYear();
        var ano_final = dataFinal.getFullYear();
        var ano = ano_inicial;
        var feriados = [];
        for (var x = ano; x <= ano_final; x++){
            //OBS: O primeiro mes é 0 e o último mes é 11
            //Feriados fixos.
            feriados = feriados.concat(FeriadosFixos(ano));
            var data_pascoa = Pascoa(ano); 
            //Feriados variaveis de acordo com a data da Pascoa
            feriados.push(data_pascoa.getTime());
            feriados.push(DataAdicionar(data_pascoa, 60).getTime());
            feriados.push(DataSubtrair(data_pascoa, 48).getTime());
            feriados.push(DataSubtrair(data_pascoa, 47).getTime());
                feriados.push(DataSubtrair(data_pascoa, 2).getTime());
                ano++;
        } 

        while (dataAtual <= dataFinal) {
            if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
                if (!feriados.includes(dataAtual.getTime())){
                    numDiasUteis++;
                }
            }
            dataAtual = DataAdicionar(dataAtual,1);
        }
        return numDiasUteis;
    }


 
    console.log('dias uteis');

 



});