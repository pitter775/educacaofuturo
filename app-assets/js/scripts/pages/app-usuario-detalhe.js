/*=========================================================================================
    File Name: app-user.js
    Description: criação edição dos usuários
    --------------------------------------------------------------------------------------
    autor: Pitter R. Bico
    contato: pitter775@gmail.com / +55 11-94950 6267
==========================================================================================*/
$(function() {
    'use strict';

    var changePicture = $('#change-picture'),
        isRtl = $('html').attr('data-textdirection') === 'rtl',
        userAvatar = $('.user-avatar');
    var formConta = $('.form-conta'); //formulario
    var formPessoais = $('.form-pessoais'); //formulario
    var formEndereco = $('.form-endereco'); //formulario
    var formResponsavel = $('.form-responsavel'); //formulario
    var formSaude = $('.form-saude'); //formulario
    var formAlimento = $('.form-alimentares'); //formulario
    var formControle = $('.form-controle'); //formulario
    var formControleAluno = $('.form-controle-aluno'); //formulario
    var formObservacao = $('.form-observacao'); //formulario

    

    var iduser = $('#iduser').val();
    var perfiluser = $('#perfiluser').val();

    // tabelas
    var tableProf = false;
    var tableObservacao = false;
    var tableAlteracao = false;
    var tableDependente = false;


    var dtProfTable = $('.prof-list-table');
    var dtObservacaoTable = $('.observacao-list-table');
    var dtAlteracaoTable = $('.alt-list-table');
    var dtDependenteTable = $('.dependente-list-table');

    var useperfil = $('#use_perfilInput').val();
    var displayno = 'display: none';
    if (useperfil == '10') {
        displayno = '';
    }
    // style="' + displayno + '"


    divUser();
    dataprof();
    dataobservacao();
    dataAlteracao();
    atualizarSituacao();
    dependenteList();

    $('.divperfilAluno').hide();
    $('.divperfilProfessor').hide();
    $('.divperfilOutro').hide();
    $('.divAltTab').hide();

    if (perfiluser == 11) {
        $('#salvarDados-cont').val('controle-aluno');
        $('.divperfilAluno').show();
        $('.divAltTab').show();
        $('#titcont').text('do Aluno');
    }
    if (perfiluser == 12) {
        $('#salvarDados-cont').val('controle-professor');
        $('#titcont').text('do Professor');
        $('.divperfilProfessor').show();
        $('.liresp').hide();
        $('.liinfo').hide();
        $('.lisaud').hide();
        $('.lialimen').hide();
        $('.divAltTab').hide();
    }
    if ($('#hempresa').val() == '') {
        $('#empresa').val(0);
        $('#empresa').trigger('change');
    }
    var data = new Date();
    var dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    $('#alt_data').val(dataFormatada);
    $('#alt_data').trigger('change');

    $('#alteracao').val(dataFormatada);
    $('#alteracao').trigger('change');

    $('#alteracao2').val(dataFormatada);
    $('#alteracao2').trigger('change');

    $('#fotoUser').on('change', function(e) {
        console.log($('#fotoUser').val());
    });
    // Change user profile picture
    if (changePicture.length) {
        $(changePicture).on('change', function(e) {

            var reader = new FileReader(),
                files = e.target.files;
            reader.onload = function() {
                if (userAvatar.length) {
                    userAvatar.attr('src', reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        });
    }
    $('#fullname').on('keyup', function() {
        $('.namefull').text($(this).val());
    });

    function divUser() {
        $.get('/usuario/getuser/' + iduser, function(retorno) {
            $('#divcarduser').html(retorno);
        });
    }
    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });

    $(document).on('click', '.btmudar', function() {
        $('#fotouser').data('tipo', 'nova');
        $('#temfoto').val('tem');
    });
    $(document).on('click', '.btreset', function(e) {
        e.preventDefault();
        $('#fotouser').data('tipo', 'avatar');

        var img = document.querySelector("#fotouser");
        img.setAttribute('src', '/app-assets/images/avatars/avatar.png');
        $('#temfoto').val('naotem');
    });
    $(document).on('click', '#deletar_td', function() {
        var t = dtProfTable.DataTable();
        var row = dtProfTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Serie do Professor',
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
                $.get('/usuario/prof/delete/' + id, function(retorno) {
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
    $(document).on('click', '#deletar_td_alteracao', function() {
        var t = dtAlteracaoTable.DataTable();
        var row = dtAlteracaoTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        console.log($(this));
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Alteracao',
            text: $(this).data('titulo') + '?',
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
                $.get('/usuario/alteracao/delete/' + id, function(retorno) {
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
    $(document).on('click', '#deletar_td_observacao', function() {
        var t = dtObservacaoTable.DataTable();
        var row = dtObservacaoTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        console.log($(this));
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Observações',
            text: $(this).data('titulo') + '?',
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
                $.get('/usuario/observacao/delete/' + id, function(retorno) {
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
    $(document).on('change', '#tipo_alteracao', function() {
        var tipo = $('select[name=tipo_alteracao] option').filter(':selected').val()
        if (tipo == 'Remanejamento' || tipo == 'Matricula') {
            $('.seriealuno').show();
        } else {
            $('.seriealuno').hide();
        }
        console.log(tipo);
    });
    $(document).on('click', '.deletar_td_dependente', function() {
        var t = dtDependenteTable.DataTable();
        var row = dtDependenteTable.DataTable().row($(this).parents('tr')).node();
        var id = $(this).data('id');
        //mensagem de confirmar 
        Swal.fire({
            title: 'Remover Dependente',
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
                $.get('/usuario/deleteDependente/' + id, function(retorno) {
                    if (retorno == 'Erro') {
                        //mensagem
                        toastr['danger']('Não pode excluir.', 'Erro!', {
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
                        toastr['success']('👋 Dependente Removido.', 'Sucesso!', {
                            closeButton: true,
                            tapToDismiss: false,
                            rtl: isRtl
                        });

                    }
                });
            }
        });
    });

    // Form Conta
    if (formConta.length) {
        formConta.validate({
            errorClass: 'error',
            rules: {
                'fullname': { required: true },
                // 'email': { required: true },
                'status': { required: true },
                'perfil': { required: true }
            }
        });

        formConta.on('submit', function(e) {
            e.preventDefault();
            var isValid = formConta.valid();
            var fototipo = $('#fotouser').data('tipo');
            if (fototipo == 'nova') {
                var url = document.getElementById("fotouser").getAttribute("src");
            }

            if (isValid) {
                var serealize = new FormData(formConta[0]);
                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    processData: false,
                    contentType: false,
                    success: function(data) {

                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados da conta alterada.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }

                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({ opacity: 0, marginTop: "100px" }, 500, "easeInQuart", function() {
                            console.log('animando');
                            divUser();
                            console.log('trocou');
                            divcarduser.animate({ opacity: 1, marginTop: "0" }, 500, "easeOutQuart", function() {});
                        });


                    }
                });
            }
        });
    }
    // Form Pessoal
    if (formPessoais.length) {
        formPessoais.validate({
            errorClass: 'error',
            rules: {
                'use_cor_pele': { required: true },
                'sexo': { required: true }
            }
        });

        formPessoais.on('submit', function(e) {
            e.preventDefault();
            var isValid = formPessoais.valid();

            if (isValid) {
                let serealize = formPessoais.serializeArray();

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados Pessoais alterada.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                //historyList();
                            });
                        });
                    }
                });
            }
        });
    }
    // Form Endereco
    if (formEndereco.length) {
        formEndereco.validate({
            errorClass: 'error',
            rules: {
                'end_rua': { required: true },
                'end_numero': { required: true },
                'end_cep': { required: true }
            }
        });

        formEndereco.on('submit', function(e) {
            e.preventDefault();
            var isValid = formEndereco.valid();
            if (isValid) {
                let serealize = formEndereco.serializeArray();

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Endereço alterado.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                //historyList();
                            });
                        });
                    }
                });
            }
        });
    }
    // Form Responsavel
    if (formResponsavel.length) {
        formResponsavel.validate({
            errorClass: 'error',
            rules: {
                //   'end_rua': { required: true },
                //   'end_numero': { required: true },
                //   'end_cep': { required: true }
            }
        });

        formResponsavel.on('submit', function(e) {
            e.preventDefault();
            var isValid = formResponsavel.valid();

            if (isValid) {
                let serealize = formResponsavel.serializeArray();
                
                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        console.log(data);
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados dos responsáveis .', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        dependenteList();
                    }
                });
            }
        });
    }
    // Form Saude
    if (formSaude.length) {
        formSaude.validate({
            errorClass: 'error',
            rules: {
                //   'end_rua': { required: true },
                //   'end_numero': { required: true },
                //   'end_cep': { required: true }
            }
        });

        formSaude.on('submit', function(e) {
            e.preventDefault();
            var isValid = formSaude.valid();

            if (isValid) {
                let serealize = formSaude.serializeArray();

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados da saúde alterada.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                //historyList();
                            });
                        });
                    }
                });
            }
        });
    }
    // Form Alimentares
    if (formAlimento.length) {
        formAlimento.validate({
            errorClass: 'error',
            rules: {
                //   'end_rua': { required: true },
                //   'end_numero': { required: true },
                //   'end_cep': { required: true }
            }
        });

        formAlimento.on('submit', function(e) {
            e.preventDefault();
            var isValid = formAlimento.valid();

            if (isValid) {
                let serealize = formAlimento.serializeArray();

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados alimentares alterada.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                //historyList();
                            });
                        });
                    }
                });
            }
        });
    }
    // Form Controle
    if (formControle.length) {
        formControle.validate({
            errorClass: 'error',
            rules: {
                //   'end_rua': { required: true },
                //   'end_numero': { required: true },
                //   'end_cep': { required: true }
            }
        });

        formControle.on('submit', function(e) {
            e.preventDefault();
            var isValid = formControle.valid();

            if (isValid) {
                let serealize = formControle.serializeArray();

                console.log(serealize);

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados de controle alterado.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            dataprof();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                //historyList();
                            });
                        });
                    }
                });
            }
        });
    }
    // Form Controle
    if (formControleAluno.length) {
        formControle.validate({
            errorClass: 'error',
            rules: {
                //   'end_rua': { required: true },
                //   'end_numero': { required: true },
                //   'end_cep': { required: true }
            }
        });

        formControleAluno.on('submit', function(e) {
            e.preventDefault();
            var isValid = formControleAluno.valid();

            if (isValid) {
                let serealize = formControleAluno.serializeArray();

                console.log(serealize);

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        console.log(data);
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados de controle alterado.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            dataAlteracao();
                            atualizarSituacao();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                //historyList();
                            });
                        });
                    }
                });
            }
        });
    }
    // Form Observacao
    if (formObservacao.length) {
        formObservacao.validate({
            errorClass: 'error',
            rules: {
                //   'end_rua': { required: true },
                //   'end_numero': { required: true },
                //   'end_cep': { required: true }
            }
        });

        formObservacao.on('submit', function(e) {
            e.preventDefault();
            var isValid = formObservacao.valid();

            if (isValid) {
                let serealize = formObservacao.serializeArray();

                console.log(serealize);

                $.ajax({
                    type: "POST",
                    url: '/usuario/cadastro',
                    data: serealize,
                    success: function(data) {
                        if (data['gravados'] == 'tudo ok') {
                            //mensagem
                            toastr['success']('👋 Dados de Observacao alterado.', 'Sucesso!', {
                                closeButton: true,
                                tapToDismiss: true,
                                rtl: isRtl
                            });
                        }
                        var divcarduser = $('#divcarduser');
                        divcarduser.animate({
                            opacity: 0,
                            marginTop: "100px"
                        }, 500, "easeInQuart", function() {
                            divUser();
                            dataprof();
                            divcarduser.animate({
                                opacity: 1,
                                marginTop: "0"
                            }, 500, "easeOutQuart", function() {
                                dataobservacao();
                            });
                        });
                    }
                });
            }
        });
    }
    // Datatable - user
    function dataprof() {
        if (tableProf) {
            tableProf.destroy();
        }
        if (dtProfTable.length) {
            var groupingTable = dtProfTable.DataTable({
                retrieve: true,
                ajax: { url: "/usuario/seriesProfAll/" + iduser, dataSrc: "" },
                columns: [

                    { data: 'id' },
                    { data: 'prof_users_id' },
                    {
                        data: function(dados) {
                            return '<span class="badge bg-light-info">' + dados.ser_nome + '</span> <span class="badge bg-light-info">' + dados.ser_periodo + '</span> <span class="badge bg-light-success"> ' + dados.ser_apelido + '</span>';
                        }
                    },
                    // { data: 'ser_nome' },
                    { data: 'prof_escolas_id' }

                ],
                columnDefs: [{
                        "targets": [1],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        "targets": [3],
                        "visible": false,
                        "searchable": false
                    },
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
                            var $id = full['id'];
                            var $nome = full['ser_nome'];
                            return (
                                '<div class="btn-group">' +
                                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                                '</a>' +
                                '<div class="dropdown-menu dropdown-menu-right">' +
                                '<a href="javascript:;" class="dropdown-item delete-record" style="' + displayno + '" data-nome="' + $nome + '" data-id="' + $id + '"  id="deletar_td">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + 'Deletar</a></div>' +
                                '</div>' +
                                '</div>'
                            );
                        }
                    }
                ],
                order: [
                    [1, 'asc']
                ],
                dom: '<"d-flex justify-content-between align-items-center mx-0">',
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

                language: {
                    "url": "/app-assets/pt_br.json",
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
            });
            $('div.head-label').html('<h6 class="mb-0">Todos os Usuários</h6>');
        }
        tableProf = groupingTable;
    }
    // Datatable - observacao
    function dataobservacao() {
        if (tableObservacao) {
            tableObservacao.destroy();
        }
        if (dtObservacaoTable.length) {
            var groupingTable = dtObservacaoTable.DataTable({
                retrieve: true,
                ajax: { url: "/usuario/observacoes/" + iduser, dataSrc: "" },
                columns: [

                    { data: 'id' },
                    { data: 'obs_titulo' },
                    { data: 'obs_texto' },
                    { data: 'obs_users_id' },
                    { data: 'obs_aluno_id' },
                    { data: 'created_at' },
                    { data: 'updated_at' },
                    { data: 'criador' },
                    { data: 'aluno' },
                    { data: 'obs_categoria' }

                ],
                columnDefs: [{
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
                        "targets": [6],
                        "visible": false,
                        "searchable": false
                    },
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
                            var $id = full['id'];
                            var $nome = full['obs_titulo'];
                            return (
                                '<div class="btn-group">' +
                                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                                '</a>' +
                                '<div class="dropdown-menu dropdown-menu-right">' +
                                '<a href="javascript:;" class="dropdown-item delete-record" style="' + displayno + '" data-titulo="' + $nome + '" data-id="' + $id + '"  id="deletar_td_observacao">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + 'Deletar</a></div>' +
                                '</div>' +
                                '</div>'
                            );
                        }
                    }
                ],
                order: [
                    [1, 'asc']
                ],
                dom: '<"d-flex justify-content-between align-items-center mx-0">',
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

                language: {
                    "url": "/app-assets/pt_br.json",
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
            });
            $('div.head-label').html('<h6 class="mb-0">Todos os Usuários</h6>');
        }
        tableObservacao = groupingTable;
    }
    // Datatable - alteracao
    function dataAlteracao() {
        if (tableAlteracao) {
            tableAlteracao.destroy();
        }
        if (dtAlteracaoTable.length) {
            var groupingTable = dtAlteracaoTable.DataTable({
                retrieve: true,
                ajax: { url: "/usuario/alteracaos/" + iduser, dataSrc: "" },
                columns: [

                    { data: 'id' },
                    { data: 'alt_tipo' },
                    { data: 'alt_series' },
                    { data: 'alt_data' }

                ],
                columnDefs: [{
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
                            var $id = full['id'];
                            var $nome = full['alt_tipo'];
                            return (
                                '<div class="btn-group">' +
                                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                                '</a>' +
                                '<div class="dropdown-menu dropdown-menu-right">' +
                                '<a href="javascript:;" class="dropdown-item delete-record" style="' + displayno + '"  data-titulo="' + $nome + '" data-id="' + $id + '"  id="deletar_td_alteracao">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + 'Deletar</a></div>' +
                                '</div>' +
                                '</div>'
                            );
                        }
                    }
                ],
                order: [
                    [1, 'asc']
                ],
                dom: '<"d-flex justify-content-between align-items-center mx-0">',
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

                language: {
                    "url": "/app-assets/pt_br.json",
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                },
            });
            $('div.head-label').html('<h6 class="mb-0">Todos os Usuários</h6>');
        }
        tableAlteracao = groupingTable;
    }

    function atualizarSituacao() {
        $.get('/usuario/atualizasituacao/' + iduser, function(retorno) {
            var dados = JSON.parse(retorno)
            var situ_matricula = dados['mat_status'];
            var situ_prof = dados['name_prof'];
            var situ_serie = dados['ser_nome'] + ' - ' + dados['ser_periodo'] + ' - ' + dados['ser_apelido'];

            console.log(situ_prof);
            if (situ_matricula == 0) {
                $('#situ_matricula').text('Não Matrículado');
            }
            if (situ_matricula == 1) {
                $('#situ_matricula').text('Matrículado');
            }
            if (situ_matricula == 2) {
                $('#situ_matricula').text('Transferido');
            }
            if (situ_matricula == 3) {
                $('#situ_matricula').text('Abandono');
            }
            if (situ_prof) {
                $('#situ_prof').text(situ_prof);
            }
            if (situ_serie) {
                $('#situ_serie').text(situ_serie);
            }
        });
    }

    // Datatable - Dependente
    function dependenteList() {
        var iduser = $('#id_geral').val();
        var groupColumn = 3;

        if (tableDependente) {
            tableDependente.destroy();
        }

        if (dtDependenteTable.length) {
            var groupingTable = dtDependenteTable.DataTable({
                // ajax: assetPath + 'data/table-datatable.json',
                retrieve: true,
                ajax: {
                    url: "/usuario/getDependente/" + iduser,
                    dataSrc: ""
                },
                columns: [
                    { data: 'id' },
                    { data: 'resp_nome' },
                    { data: 'resp_parentesco' },
                    { data: 'resp_telefone' },
                    { data: 'resp_profissao' },   
                    {
                        data: function(dados) {
                            if (dados.resp_autorizacao == 0) { return '<span class="badge bg-light-danger">Não</span>'; }
                            if (dados.resp_autorizacao == 1) { return '<span class="badge bg-light-success">Sim</span>'; }
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
                        targets: 0
                    },
                    {
                        // Actions<i data-feather='x-circle'></i>
                        targets: 6,
                        title: '',
                        orderable: false,
                        render: function(data, type, full, meta) {
                            var name = full['resp_nome'];
                            var id = full['id'];
                            return (
                                '<a href="javascript:;" class="item-edit deletar_td_dependente" data-name="' + name + '" data-id="' + id + '" style="color: #f54b20 !important">' +
                                feather.icons['x-circle'].toSvg({ class: 'font-small-4' }) +
                                '</a>'
                            );
                        }
                    }
                ],
                order: [
                    [1, 'asc']
                ],
                dom: '<"d-flex justify-content-between align-items-center mx-0">',
                displayLength: 1000,
                lengthMenu: [7, 10, 25, 50, 75, 100],


                language: {
                    paginate: {
                        // remove previous & next text from pagination
                        previous: '&nbsp;',
                        next: '&nbsp;'
                    }
                }
            });

            // Order by the grouping
            $('.dt-row-grouping tbody').on('click', 'tr.group', function() {
                var currentOrder = table.order()[0];
                if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
                    groupingTable.order([groupColumn, 'desc']).draw();
                } else {
                    groupingTable.order([groupColumn, 'asc']).draw();
                }
            });
        }
        tableDependente = groupingTable;
    }

});