const soap = require('strong-soap').soap;
const WebServerUtils = require('./utils/WebServerUtils');
class Bill {
    constructor(stageVariables) {
        this.WebServerUtils = new WebServerUtils(stageVariables);
    }

    /**
     * 1. Valida Linha Digitavel
     * @param {string} code - 846300000003015202962013710081210001001452812397
    */
    check(code) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConsultaDadosConta', 'CONSULTADADOSCONTA'),
                    EnderecoIP: self.WebServerUtils.getIP_ADDRESS(),
                    CodBarras: {
                        linhaDigitavel: code
                        //846300000003015202962013710081210001001452812397
                        //03399492813696200078677366209011100000000000000
                    }
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    if (!result) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'the server returns an empty result'
                        });
                    }

                    if (!result.ProcessaTransacaoResult) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'ProcessaTransacaoResult is undefined'
                        });
                    }

                    const { CodigoErro, MensagemErro } = result.ProcessaTransacaoResult;
                    const consulta = result.ProcessaTransacaoResult;

                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }

                    const retorno = {
                        StatusTransacao: consulta.StatusTransacao,
                        Cedente: consulta.Cedente,
                        DadosRegistro: consulta.DadosRegistro,
                        DataLiquidacao: consulta.DataLiquidacao,
                        DataVencimento: consulta.DataVencimento,
                        HoraRecebimentoFim: consulta.HoraRecebimentoFim,
                        HoraRecebimentoInicio: consulta.HoraRecebimentoInicio,
                        IndProximaLiquidacao: consulta.IndProximaLiquidacao,
                        LinhaDigitavel: consulta.LinhaDigitavel,
                        ProtocoloIdConsulta: consulta.ProtocoloIdConsulta,
                        TipoServico: consulta.TipoServico,
                        Valor: parseFloat(consulta.Valor),
                        ValorMaximo: consulta.ValorMaximo,
                        ValorMinimo: consulta.ValorMinimo
                    }
                    
                    resolve(retorno);
                });
            });
        }); 
    }

    /**
     * 2. Consulta Pendencia
    */
    checkPendency() {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConsultaPendencia', 'CONSULTAPENDENCIA'),
                    EnderecoIP: self.WebServerUtils.getIP_ADDRESS(),
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);
                    if (!result) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'the server returns an empty result'
                        });
                    }

                    if (!result.ProcessaTransacaoResult) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'ProcessaTransacaoResult is undefined'
                        });
                    }

                    const { CodigoErro, MensagemErro, PendenciaCliente } = result.ProcessaTransacaoResult;
                    const retorno  = result.ProcessaTransacaoResult;

                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }

                    // NESTE PONTO, NAO É NECESSARIO ITERAR O RESULTADO, ... VAI DEPENDER DO MODELO DE NEGOCIO
                    // let valores = {pendencias: 0};
                    // if(PendenciaCliente.TransacoesPendentes!==undefined){
                    //    valores = PendenciaCliente.TransacoesPendentes.map(item => {
                    //     return {
                    //       Autenticacao: item.Autenticacao,
                    //       DataOperacao: item.DataOperacao,
                    //       NsuExterno: item.NsuExterno,
                    //       ProtocoloId: item.ProtocoloId,
                    //       StatusPendencia: item.StatusPendencia,
                    //       TerminalIdExterno: item.TerminalIdExterno,
                    //     }
                    //   });
                    // }
                
                    // resolve(valores);

                    resolve(retorno);
                });
            });
        }); 
    }

    /**
     * 3. Consulta Status
     * @param {string} protocoloId - 
    */
    checkStatus(protocoloId) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoStatusOperacao', 'CONSULTASTATUS'),
                    EnderecoIP: self.WebServerUtils.getIP_ADDRESS(),
                    DadosConsultaOperacao: {
                        DataOperacao: '0001-01-01T00:00:00',
                        ProtocoloId: protocoloId
                    }
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    if (!result) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'the server returns an empty result'
                        });
                    }

                    if (!result.ProcessaTransacaoResult) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'ProcessaTransacaoResult is undefined'
                        });
                    }

                    const { CodigoErro, MensagemErro, DadosOperacao } = result.ProcessaTransacaoResult;

                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }

                    const retorno = {
                        Autenticacao: DadosOperacao.Autenticacao,
                        CodigoErro: DadosOperacao.CodigoErro,
                        DataOperacao: DadosOperacao.DataOperacao,
                        MensagemErro: DadosOperacao.MensagemErro,
                        NsuExterno: DadosOperacao.NsuExterno,
                        ProtocoloId: DadosOperacao.ProtocoloId,
                        StatusOperacao: DadosOperacao.StatusOperacao,
                        TerminalIdExterno: DadosOperacao.TerminalIdExterno
                    };
                
                    resolve(retorno);
                });
            });
        }); 
    }
    
    /**
     * @param {object} charging - 
     *  Example: {
     *      DataVencimento: '2018-10-28T00:00:00Z',
     *      TipoServico: 'FichaCompensacao' / 'ContaConcessionaria',
     *      LinhaDigitavel: '846300000003015202962013710081210001001452812397',
     *      Valor: 99,
     *      TipoPagamento: 'DINHEIRO' or 'CARTAO',
     *      CpfCnpj: '03884192965' [OPTIONAL]
     *  } 
    */
    pay(charging) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (!charging.DataVencimento) {
                return reject({
                    error: true,
                    code: 400,
                    detail: JSON.stringify(charging),
                    message: 'DataVencimento is required'
                });
            }

            if (!charging.Valor) {
                return reject({
                    error: true,
                    code: 400,
                    message: 'Valor is required'
                })
            }

            if (!charging.TipoPagamento) {
                return reject({
                    error: true,
                    code: 400,
                    message: 'TipoPagamento(DINHEIRO or CARTAO) is required'
                })    
            }
            
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('Conta', 'RECEBERCONTA'),
                    EnderecoIP: self.WebServerUtils.getIP_ADDRESS(),
                    CpfCnpj: charging.CpfCnpj || '03884192965',
                    SiteIntegracaoId: 0,
                    DataVencimento: charging.DataVencimento,
                    CodBarras: {
                        TipoServico: charging.TipoServico,
                        linhaDigitavel: charging.LinhaDigitavel
                    }, 
                    DadosPagamento: {
                        FormaPagamento: charging.TipoPagamento.toUpperCase(),
                        valor: charging.Valor,
                        ...self.WebServerUtils.getAttrsByCardPayment(charging),
                        valorBruto: 0,
                        valorDesconto: 0
                    }
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);
                    if (!result) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'the server returns an empty result'
                        });
                    }

                    if (!result.ProcessaTransacaoResult) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'ProcessaTransacaoResult is undefined'
                        });
                    }
                    //console.log("CONTA",result.ProcessaTransacaoResult);
                    const consulta = result.ProcessaTransacaoResult;

                    const retorno = {
                        StatusTransacao: consulta.StatusTransacao,
                        Autenticacao: consulta.Autenticacao,
                        ComprovanteFormatado: consulta.Comprovante.ComprovanteFormatado,
                        DataLiquidacao: consulta.DataLiquidacao,
                        DataOperacao: consulta.DataOperacao,
                        ProtocoloId: consulta.ProtocoloId,
                        MensagemErro: consulta.MensagemErro // caso ocorra erro será devolvido uma mensagem
                    }

                    resolve(retorno);
                });
            });
        });
    }

    /**
     * It is knowing as "estorno" in Brazil
     * @param {string} id
    */
    cancellation(id) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoEstorno', 'CANC'),
                    ProtocoloIdOriginal: id,
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);
                    if (!result) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'the server returns an empty result'
                        });
                    }

                    if (!result.ProcessaTransacaoResult) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'ProcessaTransacaoResult is undefined'
                        });
                    }

                    const { CodigoErro, MensagemErro } = result.ProcessaTransacaoResult;
                    const consulta = result.ProcessaTransacaoResult;

                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }

                    console.log("ESTORNO", consulta);
                    
                    resolve(consulta);
                });
            });
        });
    }

    /**
     * @param {string} protocoloId          - protocol id
     * @param {string} statusConfirmation   - 'CONFIRMADA' / 'CANCELADA'
     * 
    */
    confirmPayment(protocoloId, statusConfirmation) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConfirmacao', 'CONF'),
                    ProtocoloIdConfirmacao: protocoloId,
                    StatusConfirmacao: statusConfirmation
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);
                    if (!result) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'the server returns an empty result'
                        });
                    }
                    if (!result.ProcessaTransacaoResult) {
                        return reject({
                            error: true,
                            code: '',
                            message: 'ProcessaTransacaoResult is undefined'
                        });
                    }
                    const { CodigoErro, MensagemErro } = result.ProcessaTransacaoResult;
                    const consulta = result.ProcessaTransacaoResult;
                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }
                    const retorno = {
                        StatusTransacao: consulta.StatusTransacao,
                    }
                    resolve(retorno);
                });
            });
        });
    }
}

module.exports = Bill;