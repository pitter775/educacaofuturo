/*=========================================================================================
File Name: app-user.js
Description: criação edição dos usuários
--------------------------------------------------------------------------------------
autor: Pitter R. Bico
contato: pitter775@gmail.com / +55 11-94950 6267
==========================================================================================*/
$(function() {
    'use strict';
    var password = true;
    var row_edit = '';
    var confirmText = $('#confirm-text');
    var dtUserTable = $('.user-list-table');
    var dtUserHistoryTable = $('.history-list-table'), //id da tabela q esta na div  
        newUserSidebar = $('.new-user-modal'), //nome do modal
        isRtl = $('html').attr('data-textdirection') === 'rtl',
        newUserForm = $('.add-new-user'); //formula
    var tableHistory = false;
    var tableUser = false;
    var useperfil = $('#use_perfilInput').val();
    var displayno = 'display: none';
    if (useperfil == '10') {
        displayno = '';
    }
    datauser();


    flatpickr('.flatpickr-basic', {
        "dateFormat": 'd/m/Y' // locale for this instance only
    });


    function addclass(params) {
        $.get("/usuario/seriesProfAll/" + params, function(data) {
            let dadoshtml2 = '';
            setTimeout(function() {
                $.each(JSON.parse(data), function(i, item) {
                    console.log(dadoshtml2);
                    let classe = '.classe' + dados.id;
                    dadoshtml2 += item.ser_apelido + ', ';
                    $(classe).text(dadoshtml2);
                });
            }, 600);
        });
    }

    // Datatable - user
    function datauser() {
        if (tableUser) {
            tableUser.destroy();
            $('.user_role').html('');
            $('.user_plan').html('');
            $('.user_status').html('');
        }
        if (dtUserTable.length) {
            var groupingTable = dtUserTable.DataTable({
                retrieve: true,
                ajax: { url: "/usuario/all", dataSrc: "" },
                columns: [

                    { data: 'id' },
                    {
                        data: function(dados) {
                            let image = '';
                            if (dados.use_foto !== '' && dados.use_foto !== null && dados.use_foto !== 'undefined') {
                                image = '<img src="/arquivos/' + dados.use_foto + '" alt="Avatar" height="26" title="b" width="26"/>'
                            } else {
                                image = '<img src="/app-assets/images/avatars/avatar.png" alt="Avatar" height="26" width="26" />'
                            }
                            return '<div data-toggle="tooltip" data-popup="tooltip-custom" data-placement="top" title="" data-iduser="' + dados.id + '" class="avatar btavataruser pull-up my-0" data-original-title="' + dados.name + '">' +
                                image + '</div>';
                        }
                    },
                    { data: 'name' },
                    {
                        data: function(dados) {
                            let valordados = '';

                            if (dados.use_perfil == 12) {
                                if (dados.name) {
                                    return '<span class="classe' + dados.id + '"> ... </span>';
                                }
                            } else {
                                if (dados.ser_apelido == null) { return 'sem classe'; } else {
                                    return dados.ser_apelido + ' - ' + dados.ser_nome;
                                }
                            }
                        }
                    },
                    { //format perfil
                        data: function(dados) {
                            let bairro = dados.end_bairro + ' - ';
                            if (dados.use_perfil == 12) {
                                addclassprof(dados.id);
                            }
                            return bairro + dados.end_cidade;
                        }
                    },
                    { data: 'use_sexo' },
                    { data: 'use_gemeo' },
                    { //format perfil
                        data: function(dados) {
                            if (dados.use_perfil == 1) { return 'Usuario'; }
                            if (dados.use_perfil == 10) { return 'ADM'; }
                            if (dados.use_perfil == 11) { return 'Aluno'; }
                            if (dados.use_perfil == 12) { return 'Professor'; }
                            if (dados.use_perfil == 13) { return 'Diretoria'; }
                            if (dados.use_perfil == 14) { return 'Secretaria'; }
                            if (dados.use_perfil == 15) { return '--'; }
                            if (dados.use_perfil == 16) { return 'Site - Matricula'; }
                            if (dados.use_perfil == 17) { return 'Supervisora'; }
                        }
                    },
                    {
                        data: function(dados) {
                            if (dados.use_status == null) { return '<span class="badge bg-light-danger">Sem status</span>'; }
                            if (dados.use_status == 0) { return '<span class="badge bg-light-danger">Sem status</span>'; }
                            if (dados.use_status == 2) { return '<span class="badge bg-light-danger">Inativo</span>'; }
                            if (dados.use_status == 1) { return '<span class="badge bg-light-success">Ativo</span>'; }
                            if (dados.use_status == 3) { return '<span class="badge bg-light-danger">Aguardando Vaga</span>'; }
                            if (dados.use_status == 4) { return '<span class="badge bg-light-danger">Fechamento de matricula</span>'; }
                        }
                    }
                ],
                columnDefs: [
                    // {
                    //     "targets": [ 0 ],
                    //     "visible": false,
                    //     "searchable": false
                    // },
                    {
                        // para responsividade
                        className: 'control',
                        orderable: false,
                        responsivePriority: 2,
                        targets: 0
                    },
                    {
                        // Actions
                        targets: 0,
                        title: 'Ação',
                        orderable: false,
                        render: function(data, type, full, meta) {
                            var $id = full['id'],
                                $name = full['name'],
                                $email = full['email'],
                                $perfil = full['use_perfil'],
                                $status = full['use_status'];




                            return (
                                '<div class="btn-group">' +
                                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                                '</a>' +
                                '<div class="dropdown-menu dropdown-menu-right">' +
                                '<a class="dropdown-item" href="usuario/detalhes/' + $id + '">' + feather.icons['file-text'].toSvg({ class: 'font-small-4 mr-50' }) + 'Detalhes</a>' +
                                '<a href="javascript:;" class="dropdown-item delete-record" style="' + displayno + '" data-id="' + $id + '" data-name="' + $name + '"  id="deletar_td">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + 'Deletar</a></div>' +
                                '</div>' +
                                '</div>'
                            );
                        }
                    }
                ],
                order: [
                    [2, 'asc']
                ],
                dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-right"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                displayLength: 10,
                lengthMenu: [10, 25, 50, 75, 100],
                language: {
                    "url": "/app-assets/pt_br.json",
                    paginate: {
                        // remove previous & next text da pagina
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
                        text: feather.icons['plus'].toSvg({ class: 'mr-50 font-small-4 ' }) + 'Novo usuário',
                        className: 'create-new btn btn-primary waves-effect',
                        attr: {
                            'data-toggle': 'modal',
                            'data-target': '#modals-slide-in',
                            'style': displayno
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
                initComplete: function() {
                    // Adding role filter once table initialized
                    this.api()
                        .columns(5)
                        .every(function() {
                            var column = this;
                            var select = $(
                                    '<select id="UserRole" class="form-control select2 "><option value=""> Sexo </option></select>'
                                )
                                .appendTo('.user_role')
                                .on('change', function() {
                                    var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                });

                            column
                                .data()
                                .unique()
                                .sort()
                                .each(function(d, j) {
                                    select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
                                });
                        });
                    // Adding plan filter once table initialized
                    this.api()
                        .columns(7)
                        .every(function() {
                            var column = this;
                            var select = $(
                                    '<select id="UserPlan" class="form-control select2"><option value=""> Perfil </option></select>'
                                )
                                .appendTo('.user_plan')
                                .on('change', function() {
                                    var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                });

                            column
                                .data()
                                .unique()
                                .sort()
                                .each(function(d, j) {
                                    select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
                                });
                        });
                    // Adding status filter once table initialized

                    this.api()
                        .columns(3)
                        .every(function() {
                            var column = this;
                            var select = $(
                                    '<select id="UserStatus" class="form-control select2"><option value=""> Série </option></select>'
                                )
                                .appendTo('.user_status')
                                .on('change', function() {
                                    var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                });

                            column
                                .data()
                                .unique()
                                .sort()
                                .each(function(d, j) {
                                    console.log(d);
                                    if (d.substr(0, 5) !== "<span") {
                                        select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
                                    }
                                });
                        });
                    // Adding status filter once table initialized

                }
            });
            setTimeout(function() {
                $('div.head-label').html('<h6 class="mb-0">Todos os Usuários</h6>');
                console.log('foi');
            }, 1000);
           
        }
        tableUser = groupingTable;
    }

    function dataBR(data) {
        //do americano para portugues
        let datef = new Date(data);
        let dataFormatada = datef.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        return dataFormatada
    }

    function dataUS(data) {
        //do portugues para o americano
        let dataFormatada = data.split('/').reverse().join('-');
        return dataFormatada
    }
    // Check Validity
    function checkValidity(el) {
        if (el.validate().checkForm()) {
            submitBtn.attr('disabled', false);
        } else {
            submitBtn.attr('disabled', true);
        }
    }
    // Form Validation
    if (newUserForm.length) {
        newUserForm.validate({
            errorClass: 'error',
            rules: {
                'fullname': { required: true },
                'status': { required: true }
            }
        });

        newUserForm.on('submit', function(e) {
            var isValid = newUserForm.valid();
            e.preventDefault();
            if (isValid) {
                let serealize = newUserForm.serializeArray();
                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['tipo-geral'] == 'novo') {
                            window.location.href = "/usuario/detalhes/" + data['id-geral'];
                        }
                        if (data['tipo-geral'] == 'editado') {
                            editarlinha(serealize, data);
                            newUserSidebar.modal('hide');
                        }
                    }
                });
            }
        });
    }

    function addclassprof(params) {
        $.get("/usuario/seriesProfAll/" + params, function(data) {
            let dadoshtml2 = '';
            $.each(JSON.parse(data), function(i, item) {
                let classe = '.classe' + params;
                dadoshtml2 += item.ser_apelido + ', ';
                $(classe).html(dadoshtml2);
                console.log(params + '-', dadoshtml2);
                console.log(params + 'feito em - ', classe);
            });
        });
    }

    function editarlinha(serealize, data) {
        datauser();
        //mensagem
        toastr['success']('👋 Arquivo alterado.', 'Sucesso!', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
        });
    }

    function addnovalinha(serealize, data) {

        var t = dtUserTable.DataTable();
        var rowNode = t
            .row.add({
                "id": data,
                "email": serealize[5]['value'],
                "name": serealize[2]['value'],
                "perfil": serealize[4]['value'],
                "status": serealize[3]['value'],
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
        $(".btdetalhe").hide();

        $('#id_geral').val('');
        $('#fullname').val('');
        $('#email').val('');

    });
    $(document).on('click', '#deletar_td', function() {
        var t = dtUserTable.DataTable();
        var row = dtUserTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover o Usuário',
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
                $.get('/usuario/delete/' + id, function(retorno) {
                    if (retorno == 'erro') {
                        //mensagem
                        toastr['error']('👋 Arquivo comprometido, não pode excluir.', 'Erro!', {
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
    $(document).on('click', '.deletar_td_history', function() {
        var t = dtUserHistoryTable.DataTable();
        var row = dtUserHistoryTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover do Histórico',
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
                $.get('/historico/delete/' + id, function(retorno) {
                    if (retorno == 'Erro') {
                        //mensagem
                        toastr['error']('👋 Arquivo comprometido, não pode excluir.', 'Erro!', {
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
    $(document).on('click', '.btavataruser', function() {
        console.log('btavataruser');
        let iduser = $(this).data('iduser');
        window.open('/usuario/detalhes/' + iduser, '_blank');
        // window.location.href = "/usuario/detalhes/" + iduser;
    });
    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});