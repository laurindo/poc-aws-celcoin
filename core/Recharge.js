const soap = require('strong-soap').soap;
const WebServerUtils = require('./utils/WebServerUtils');
class Recharge {
    constructor(stageVariables) {
        this.WebServerUtils = new WebServerUtils(stageVariables);
    }

    /**
     * @param {string} dddValue - 11, 85, other value
    */
    getOperatorsDDD(dddValue) {
        const self = this;
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    /**
     * @param {string} dddValue - 11, 85, other value
     * @param {string} operator - 2097
    */
    getValuesOperatorDDD(dddValue, operator) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
      
            const args = {
              transacao: {
                ...self.WebServerUtils.getTransactionArgs('TransacaoConsultaValoresOperadoraDDD', 'CONSULTAVALORESOPERADORADDD'),
                OperadoraId: operator,
                ddd: dddValue
              }
            };
      
            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);
      
                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    const { CodigoErro, MensagemErro, Valores } = result.ProcessaTransacaoResult;

                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }

                    const valores = Valores.ValorRecarga.map(item => {
                        return {
                        coast: parseFloat(item.CustoRecarga),
                        name: item.NomeProduto,
                        validate: parseInt(item.ValidadeProduto),
                        bonus: parseFloat(item.ValorBonus),
                        max: parseFloat(item.ValorMax),
                        min: parseFloat(item.ValorMin)
                        }
                    });
                
                    resolve(valores);
                });
            });
        });
    }

    getPendencia() {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConsultaPendencia', 'CONSULTAPENDENCIA'),
                    EnderecoIP: '127.0.0.1',
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

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

    getStatus(id) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoStatusOperacao', 'CONSULTASTATUS'),
                    EnderecoIP: '127.0.0.1',
                    DadosConsultaOperacao: {
                        DataOperacao: '0001-01-01T00:00:00',
                        ProtocoloId: id
                    }
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    const { CodigoErro, MensagemErro, Operadoras } = result.ProcessaTransacaoResult;

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

    consultaLimite() {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConsultaLimite', 'CONSULTALIMITES'),
                    EnderecoIP: '127.0.0.1'
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
                        CreditoAntecipado: parseFloat(consulta.CreditoAntecipado),
                        LimiteConsumido: parseFloat(consulta.LimiteConsumido),
                        LimiteCredito: parseFloat(consulta.LimiteCredito),
                        LimiteDisponivel: parseFloat(consulta.LimiteDisponivel)
                    }
                    
                    resolve(retorno);
                });
            });
        });    
    }

    /**
     * @param {string} ddd              - 11, 85, other value
     * @param {string} operatorId       - 2097, 2098, other value
     * @param {string} phoneNumber      - 998876756, other value
     * @param {number} valueToPay       - 15, 20, 25, other value
     * @param {string} paymentType      - DINHEIRO or CARTAO
    */
    doRecharge(ddd, operatorId, phoneNumber, valueToPay, paymentType) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('Recarga', 'RECARGA'),
                    EnderecoIP: '127.0.0.1',
                    DadosConsultaOperacao: {
                        DataOperacao: '0001-01-01T00:00:00',
                        TerminalExterno: self.WebServerUtils.getExternalTerminal(),
                        DadosPagamento: {
                            FormaPagamento: paymentType,
                            QtdParcelas: 0,
                            pontos: 0,
                            valor: valueToPay,
                            valorBruto: 0,
                            valorDesconto: 0
                        },
                        operadoraId: operatorId,
                        telefoneRecarga: {
                            CodigoEstado: ddd, 
                            CodigoPais: 55,
                            Numero: phoneNumber
                        }
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
                    //console.log("RECARGA",consulta);

                    const retorno = {
                        Autenticacao: consulta.Autenticacao,
                        Comprovante: { 
                            CamposComprovante: consulta.Comprovante.CamposComprovante,
                            ComprovanteFormatado: consulta.Comprovante.ComprovanteFormatado
                        },
                        DataLiquidacao: consulta.DataLiquidacao,
                        DataOperacao: consulta.DataOperacao,
                        ProtocoloId: consulta.ProtocoloId
                    }
                    
                    resolve(retorno);
                });
            });
        });     
    }

    confirmation(id) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConfirmacao', 'CONF'),
                    EnderecoIP: '127.0.0.1',
                    ProtocoloIdConfirmacao: id,
                    StatusConfirmacao: 'CONFIRMADA'
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
                    }
                    
                    resolve(retorno);
                });
            });
        });     
    }
}

module.exports = Recharge;