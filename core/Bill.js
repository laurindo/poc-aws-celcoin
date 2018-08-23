const soap = require('strong-soap').soap;
const WebServerUtils = require('./utils/WebServerUtils');
class Bill {
    constructor(stageVariables) {
        this.WebServerUtils = new WebServerUtils(stageVariables);
    }

    /**
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
                    EnderecoIP: '127.0.0.1',
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

            if (!charging.typePayment) {
                return reject({
                    error: true,
                    code: 400,
                    message: 'typePayment(DINHEIRO or CARTAO) is required'
                })    
            }
            
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('Conta', 'RECEBERCONTA'),
                    EnderecoIP: '127.0.0.1',
                    CpfCnpj: charging.CpfCnpj || '03884192965',
                    SiteIntegracaoId: 0,
                    CodBarras: {
                        TipoServico: cobranca.TipoServico,
                        linhaDigitavel: cobranca.LinhaDigitavel
                      }, 
                      DadosPagamento: {
                        FormaPagamento: typePayment,
                        valor: cobranca.Valor, 
                        // QtdParcelas: 0,
                        // pontos: 0,
                        valorBruto: 0,
                        valorDesconto: 0
                      },
                      DataVencimento: cobranca.DataVencimento
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    //console.log("CONTA",result.ProcessaTransacaoResult);
                    const consulta = result.ProcessaTransacaoResult;

                    const retorno = {
                    StatusTransacao: consulta.StatusTransacao,
                    Autenticacao: consulta.Autenticacao,
                    ComprovanteFormatado: consulta.Comprovante.ComprovanteFormatado,
                    DataLiquidacao: consulta.DataLiquidacao,
                    DataOperacao: consulta.DataOperacao,
                    ProtocoloId: consulta.ProtocoloId
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
}

module.exports = Bill;