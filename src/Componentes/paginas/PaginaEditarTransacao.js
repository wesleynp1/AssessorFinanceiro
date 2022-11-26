import { View,Text, Button } from "react-native";
import FormularioTransacao from "../FormularioTransacao";
import {Picker} from '@react-native-picker/picker';
import { useState } from "react";

const PaginaEditarTransacao = ({atualizarTransacao,transacaoInicial, nomeContas})=>{
    const [eDespesa,seteDespesa] = useState(transacaoInicial.valor<0 ? true : false);

    const aoSubmenter = (t)=>{
        t.id = transacaoInicial.id;
        atualizarTransacao(t);
    }

    return(
        <View>
            <Text style={{color:(eDespesa ? "red" : "green"),fontSize:16, margin: 10, textAlign:"center"}}>
                INSIRA AS INFORMAÇÕES DA NOVA {(eDespesa ? "DESPESA" : "RECEITA")}
            </Text>

            <Picker 
                selectedValue={eDespesa}
                onValueChange={v=>{seteDespesa(v)}}
                dropdownIconColor="black"
                style={{color:"black",textAlign:"center"}}
                >
                
                <Picker.Item label="DESPESA" value={true}/>
                <Picker.Item label="RECEITA" value={false}/>
            </Picker>

            <FormularioTransacao    transacaoInicial={transacaoInicial} 
                                    contas={nomeContas}
                                    eDespesa={eDespesa}
                                    aoSubmeter={aoSubmenter}/>
        </View>
    );
}

export default PaginaEditarTransacao