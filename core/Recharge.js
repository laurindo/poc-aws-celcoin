const soap = require('strong-soap').soap;
class Recharge {
    constructor(WSDL_URI, SOAPAction, PONTO_ATENDIMENTO_LOGIN, PONTO_ATENDIMENTO_PASSWORD) {
        this.WSDL_URI = WSDL_URI;
        this.SOAPAction = SOAPAction;
        this.PONTO_ATENDIMENTO_LOGIN = PONTO_ATENDIMENTO_LOGIN;
        this.PONTO_ATENDIMENTO_PASSWORD = PONTO_ATENDIMENTO_PASSWORD;
    }
    getOperatorsDDD(dddValue) {
        const self = this;
        return new Promise((resolve, reject) => {
            const wsdlUri = self.WSDL_URI;//'http://hmlgtodaconta.is2b.com.br:54003/TodaConta/WebService?wsdl';

            const options = {
                wsdl_headers: {
                    'SOAPAction': self.SOAPAction,//'http://GatewayWebService/IGatewayWeb/ProcessaTransacao',
                    'Content-Type': 'text/xml'
                },
                envelopeKey: 's'
            };

            const args = {
                transacao: {
                // Set attributes to node
                    $attributes: {
                        $xsiType: {
                            type: 'TransacaoConsultaOperadoraDDD',
                            xmlns: 'http://schemas.datacontract.org/2004/07/TodaConta.WebService.Transacoes'
                        },
                    },
                    CpfCnpj: '39233281922',
                    PontoAtendimento: {
                        Login: self.PONTO_ATENDIMENTO_LOGIN,
                        Senha: self.PONTO_ATENDIMENTO_PASSWORD
                    },
                    TipoTransacao: 'CONSULTAOPERADORADDD',
                    CategoriaRecarga: 'TODOS',
                    TipoRecarga: 'ONLINE',
                    ddd: dddValue
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = client['GatewayWeb']['BasicHttpBinding_IGatewayWeb']['ProcessaTransacao'];

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
                    console.log(Operadoras);
                    resolve(Operadoras);
                    // const operadoras = Operadoras.Operadora.map(item => {
                    //   return {
                    //     id: parseInt(item.OperadoraId),
                    //     name: item.Nome,
                    //     max: parseFloat(item.ValorMax),
                    //     min: parseFloat(item.ValorMin)
                    //   }
                    // });

                    // resolve(operadoras);
                });
            });
        });
    }
}

module.exports = Recharge;