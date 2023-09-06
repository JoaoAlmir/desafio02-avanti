import { prismaClient } from "../database/prisma-client-js.js";

//vizualização de todos os campeonatos
export const getCampeonatos = async (request, response) => {
    try {
        const campeonatos = await prismaClient.campeonato.findMany();
        response.status(200).json(campeonatos);
    } catch (e) {
        return response.status(500).send(e.message);
    }
}
//vizualização de um campeonato por id
export const getCampeonato = async (request, response) => {
    try {
        let idParams = request.params.id;
        const campeonato = await prismaClient.campeonato.findUnique({
            where: { id:idParams },
          })
        response.status(200).json(campeonato);
    } catch (e) {
        return response.status(500).send(e.message);
    }
}
//criação de um campeonato
export const createCampeonato = async (request, response) => {
    try {
        const { nome, data_inicio, data_fim } = request.body;

        const campeonato = await prismaClient.campeonato.create({
            data: {
                nome,
                data_inicio: new Date(data_inicio),
                data_fim: new Date(data_fim),
            },
        });

        if (data_inicio < data_fim) {
            return response.status(201).json(campeonato);
        }
        else{
            return response.status(400).send('Data de início maior que data de fim');
        }
    }
    catch (e) {
        return response.status(500).send(e.message);
    }
}
//atualização de um campeonato
export const updateCampeonato = async (request, response) => {
    try {
        const campeonato = await prismaClient.campeonato.findUnique({ where: { id: request.params.id } });
        if (!campeonato) {
            return response.status(404).json({ err: 'Campeonato não encontrado' });
        }
        const updatedCampeonato = await prismaClient.campeonato.update({
            where: {
                id: request.params.id
            },
            data: request.body
        });
        return response.status(200).json(updatedCampeonato)
    } catch (e) {
        return response.status(500).send(e.message);
    }
}

//exclusão de um campeonato
export const deleteCampeonato = async (request, response) => {
    try {
        const campeonato = await prismaClient.campeonato.findUnique({ where: { id: request.params.id } });
        if (!campeonato) {
            return response.status(404).json({ err: 'Campeonato não encontrado!' });
        }

        const deletedCampeonato = await prismaClient.campeonato.delete({
            where: {
                id: request.params.id
            }
        })
        return response.status(200).json(deletedCampeonato);

    } catch (e) {
        return response.status(500).json(e.message);
    }
}

export default { getCampeonatos, createCampeonato, updateCampeonato, deleteCampeonato };