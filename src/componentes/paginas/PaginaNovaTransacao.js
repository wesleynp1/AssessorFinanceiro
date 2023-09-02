import { View,Text, Alert} from "react-native";
import FormularioTransacao from "../FormularioTransacao";
import { inteiroParaReal } from "../CampoDinheiro";

const PaginaNovaTransacao = ({novaTransacao, nomeContas, eDespesa})=>{
    
    let transacaoInicial = {categoria:"",
                            conta: nomeContas[0],
                            data: new Date(),
                            valor:0}

    const ConfirmarRegistrarTransacao = (tr)=>{
            Alert.alert(
                "Adicionar Transação",
                "Registrar a " + (eDespesa ? "despesa" : "receita") + 
                " de "+ inteiroParaReal(tr.valor) + "(" + tr.conta + ")" +
                " em "+ 
                ("0"+tr.data.getDate()).slice(-2) + "/" + 
                ("0"+(tr.data.getMonth()+1)).slice(-2) +"/" +
                (tr.data.getFullYear()) +
                " da categoria " + tr.categoria + "?",
                [
                    {
                        text:"Cancelar"
                    },
                    {
                        text:"Registrar",
                        onPress: ()=> novaTransacao(tr)
                    }
                ]
                );
        }
    

    return(
        <View>
            <Text style={{color:(eDespesa ? "red" : "green"),fontSize:16, margin: 10, textAlign:"center"}}>
                INSIRA AS INFORMAÇÕES DA NOVA {(eDespesa ? "DESPESA" : "RECEITA")}
            </Text>

            <FormularioTransacao    
            transacaoInicial={transacaoInicial} 
            contas={nomeContas}
            eDespesa={eDespesa}
            aoSubmeter={tr=>{ConfirmarRegistrarTransacao(tr)}}/>
        </View>
    );
}

export default PaginaNovaTransacao