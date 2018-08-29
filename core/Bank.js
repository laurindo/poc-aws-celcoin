const soap = require('strong-soap').soap;
const WebServerUtils = require('./utils/WebServerUtils');

class Bank {
    constructor(stageVariables) {
        this.WebServerUtils = new WebServerUtils(stageVariables);
    }

    listBanks() {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoConsultaBanco', 'CONSULTABANCOS'),
                    EnderecoIP: self.WebServerUtils.getIP_ADDRESS()
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

                    const retorno = consulta.ListaBancos.Banco;
                    resolve(retorno);
                });
            });
        });
    }

    /**
     * {
            typePayment: 'DINHEIRO',
            amountParcels: 0,
            agencyNumber: 122,
            accountNumber: 12121,
            bankId: 104,
            fullName: TESTE caixa cc,
            verifyDigit: 2,
            typeAccountBank: 'cc',
            price: 501.50
     * }
    */
    transfer(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WebServerUtils.getWSDL_URI();
            const options = self.WebServerUtils.getOptions();
            const args = {
                transacao: {
                    ...self.WebServerUtils.getTransactionArgs('TransacaoSaqueBanco', 'SAQUEBANCO'),
                    EnderecoIP: self.WebServerUtils.getIP_ADDRESS(),
                    CpfCnpj: "30410597899",
                    NSUExterno: "000000210602",
                    Agencia: data.agencyNumber,
                    BancoId: data.bankId,
                    Conta: data.accountNumber,
                    DigitoVerificador: data.verifyDigit,
                    NomeCompleto: data.fullName,
                    TipoContaBancaria: data.typeAccountBank.toUpperCase(), //CC
                    DadosPagamento: {
                        FormaPagamento: data.typePayment.toUpperCase(),
                        QtdParcelas: data.amountParcels,
                        pontos: 0,
                        valor: data.price,
                        valorBruto: 0.0,
                        valorDesconto: 0.0
                    }
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = self.WebServerUtils.getMethodToProcessTransaction(client);

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    const { 
                        CodigoErro, 
                        MensagemErro,
                        ProtocoloId,
                        DataOperacao,
                        DataLiquidacao,
                        DataPrevisaoProcessamento,
                        Autenticacao,
                    } = result.ProcessaTransacaoResult;
                    
                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }

                    resolve({
                        CodigoErro, 
                        MensagemErro,
                        ProtocoloId,
                        DataOperacao,
                        DataLiquidacao,
                        DataPrevisaoProcessamento,
                        Autenticacao,
                    });
                });
            });
        });    
    }
}

module.exports = Bank;