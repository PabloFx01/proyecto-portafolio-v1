package SpringBootRestctrlPagos.services.ctrlEfectivo;

import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoConsultaDTO;
import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoConsultaDTO2;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Movimiento;

import java.util.List;
import java.util.Optional;

public interface IMovimientoService {
    List<Movimiento> findAll();

    List<Movimiento> findAllAndChildrenByUsername(String username);
    List<Movimiento> findAllAndChildrenByUsernameAsc(String username);

    ListadoPaginador<Movimiento> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username);

    ListadoPaginador<Movimiento> findAllConsultaMovWithPaginationByUsername(Long cantidad,
                                                                  int pagina,
                                                                  String startMov,
                                                                  String endMov,
                                                                  String idSobre,
                                                                  String tipoMov,
                                                                  String username
    );

    List<MovimientoConsultaDTO> findAllConsultaMovByUsername(
            String startMov,
            String endMov,
            String idSobre,
            String tipoMov,
            String username
    );

    List<MovimientoConsultaDTO2> getAllConsultaMovByUsername(
            String startMov,
            String endMov,
            String idSobre,
            String tipoMov,
            String username
    );

    List<MovimientoConsultaDTO2> getAllConsultaADDMovByUsername(
            String startMov,
            String endMov,
            String idSobre,
            String tipoMov,
            String username
    );


    Optional<Movimiento> findById(Long id);

    List<Movimiento> findByIdSobreAndChildren(Long id);

    void saveOrUpdate(Movimiento movimiento);

    void deleteById(Long id);
}
