import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ViaCepService {
  async buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new HttpException('CEP not found', HttpStatus.NOT_FOUND);
    }
    
    return {
      bairro: data.bairro,
      endereco: data.logradouro,
      estado: data.uf,
      cidade: data.localidade,
    };
  }
}