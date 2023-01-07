import React,{useState} from "react";
import {TextInput} from "react-native";

//Ideia de componente encapsulado que corrige e filtra entradas do usuário retornando o valor "data"

const filtrarCaracteres = (texto)=>{ //retorna um texto apenas com numeros a partir do texto fornecido
    return  Array.from(texto)
            .filter(c =>"0123456789".includes(c))//caracteres permitidos
            .join("");
}

const textoParaDate = (textoDigitado)=>{ //retorna um objeto Date a partir de um texto(DD/MM/AAAA)  
    let textoFiltrado = filtrarCaracteres(textoDigitado);

    if(textoFiltrado.length>=8)
    {
        let dia = parseInt(textoFiltrado.substring(0,2));
        let mes = parseInt(textoFiltrado.substring(2,4))-1;
        let ano = parseInt(textoFiltrado.substring(4,8));

        // D D M M A A A A
        //0 1 2 3 4 5 6 7 8

        return new Date(ano,mes,dia)
    }
    else
    {
        return new Date();
    }
}

export const dateParaTexto = (d)=>{ //retorna um texto(DD/MM/AAAA) a partir de um objeto Date
        return ("0"+d.getDate()).slice(-2) +"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+d.getFullYear();
}

const formataTextoDDMMAAAA = (textoDigitado)=>{//retorna um texto em DD/MM/AAAA a partir de um texto fornecido

    let textoFiltrado = filtrarCaracteres(textoDigitado);

    if(textoFiltrado.length>=8)
    { 
    let dia = textoFiltrado.substring(0,2);
    let mes = textoFiltrado.substring(2,4);
    let ano = textoFiltrado.substring(4,8);

    // D D M M A A A A
    //0 1 2 3 4 5 6 7 8

    return dia + "/" + mes + "/" + ano;
    }
    else
    {
        return textoFiltrado;
    }
}

export const validarData = (data)=>{
    if(data.toString().length!=8)return false;

    let dataEmTexto = data.toString();

    let ano = parseInt(dataEmTexto.substring(0,4));
    let mes = parseInt(dataEmTexto.substring(4,6));
    let dia = parseInt(dataEmTexto.substring(6,8));

    //formato  A A A A M M D D
    //        0 1 2 3 4 5 6 7 8 

    let anoOk = ano!=0;
    let mesOk = 0 < mes && mes < 13;
    let diaOk = 0 < dia && dia < 32;

    return anoOk && mesOk && diaOk;
}

const CampoData = ({aoMudarTexto, valorInicial, estilo, referencia=()=>{}})=> {
    const [valor, setValor] = useState(dateParaTexto(valorInicial));

    return(
    <TextInput  
        maxLength={10}
        style={estilo} 
        placeholderTextColor="gray"
        placeholder="Informe a data..."
        value={valor}
        keyboardType="number-pad"
        onChangeText={t =>{
            setValor(formataTextoDDMMAAAA(t)); // o que usuário vai ver
            aoMudarTexto(textoParaDate(t)); // o que o aplicativo vai ver
        }}
        ref={r=>{referencia(r)}}
        />
    );
}

export default CampoData;