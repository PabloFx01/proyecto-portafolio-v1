package SpringBootRestctrlPagos.controllers.ctrlEfectivo;


import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoConsultaDTO;
import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoConsultaDTO2;
import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Movimiento;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ICuentaService;
import SpringBootRestctrlPagos.services.ctrlEfectivo.IMovimientoService;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ITransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ctrlEfectivo/movimientos")
public class MovimientoController {
    @Autowired
    private IMovimientoService movimientoService;
    @Autowired
    private ITransaccionService transaccionService;
    @Autowired
    private IUserService userService;
    @Autowired
    private ICuentaService cuentaService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Movimiento> movimientoOptional = movimientoService.findById(id);
        if (movimientoOptional.isPresent()) {
            Movimiento movimiento = movimientoOptional.get();
            MovimientoDTO movimientoDTO = movimientoToMovimientoDTO(movimiento);
            return ResponseEntity.ok(movimientoDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findAllByUsername")
    public ResponseEntity<?> findAllByUsername(@RequestParam String username) {
        List<MovimientoDTO> movimientoList = movimientoService.findAllAndChildrenByUsername(username)
                .stream()
                .map(movimiento -> movimientoToMovimientoDTO(movimiento))
                .toList();

        return ResponseEntity.ok(movimientoList);
    }

    @GetMapping("/findAllPaginadoByUsername/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam(required = false) String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Movimiento> listadoPaginador =
                movimientoService.findAllWithPaginationByUsername(cantidad, pagina, filter, username);

        return ResponseEntity.ok(listadoPaginador);
    }

    @GetMapping("/findAllConsultaMovWithPaginationByUsername/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllConsultaMovWithPagination(@PathVariable("cantidad") Long cantidad,
                                                              @PathVariable("pagina") int pagina,
                                                              @RequestParam(required = false) String startDateFilter,
                                                              @RequestParam(required = false) String endDateFilter,
                                                              @RequestParam(required = false) String idSobreFilter,
                                                              @RequestParam(required = false) String tipoMovFilter,
                                                              @RequestParam(required = false) String username) {

        ListadoPaginador<Movimiento> listadoPaginador =
                movimientoService.findAllConsultaMovWithPaginationByUsername(cantidad,
                        pagina,
                        startDateFilter,
                        endDateFilter,
                        idSobreFilter,
                        tipoMovFilter,
                        username);

        return ResponseEntity.ok(listadoPaginador);
    }

    @GetMapping("/findAllConsultaMovByUsername")
    public ResponseEntity<?> findAllConsultaMovByUsername(
            @RequestParam(required = false) String startDateFilter,
            @RequestParam(required = false) String endDateFilter,
            @RequestParam(required = false) String idSobreFilter,
            @RequestParam(required = false) String tipoMovFilter,
            @RequestParam(required = false) String username) {
        List<MovimientoConsultaDTO> movimientoList =
                movimientoService.findAllConsultaMovByUsername(
                        startDateFilter,
                        endDateFilter,
                        idSobreFilter,
                        tipoMovFilter,
                        username);

        return ResponseEntity.ok(movimientoList);
    }

    @GetMapping("/getAllConsultaMovByUsername")
    public ResponseEntity<?> getAllConsultaMovByUsername(
            @RequestParam(required = false) String startDateFilter,
            @RequestParam(required = false) String endDateFilter,
            @RequestParam(required = false) String idSobreFilter,
            @RequestParam(required = false) String tipoMovFilter,
            @RequestParam(required = false) String username) {
        List<MovimientoConsultaDTO2> movimientoList =
                movimientoService.getAllConsultaMovByUsername(
                        startDateFilter,
                        endDateFilter,
                        idSobreFilter,
                        tipoMovFilter,
                        username);

        return ResponseEntity.ok(movimientoList);
    }

    @GetMapping("/getAllConsultaADDMovByUsername")
    public ResponseEntity<?> getAllConsultaADDMovByUsername(
            @RequestParam(required = false) String startDateFilter,
            @RequestParam(required = false) String endDateFilter,
            @RequestParam(required = false) String idSobreFilter,
            @RequestParam(required = false) String tipoMovFilter,
            @RequestParam(required = false) String username) {
        List<MovimientoConsultaDTO2> movimientoList =
                movimientoService.getAllConsultaADDMovByUsername(
                        startDateFilter,
                        endDateFilter,
                        idSobreFilter,
                        tipoMovFilter,
                        username);

        return ResponseEntity.ok(movimientoList);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody MovimientoDTO movimientoDTO) throws URISyntaxException {
        try {
            Optional<Usuario> optionalUser = userService.findByUsername(movimientoDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Optional<Cuenta> optionalCuenta = cuentaService.findByIdSobre(movimientoDTO.getCuenta().getSobre().getId());
                if (optionalCuenta.isPresent()) {
                    movimientoDTO.setUsuario(optionalUser.get());
                    movimientoDTO.setCuenta(optionalCuenta.get());
                    movimientoService.saveOrUpdate(movimientoDTOToMovimiento(movimientoDTO));
                    Response response = new Response();
                    response.setIdMessage("201");
                    response.setMessage("Registro creado con éxito.");
                    return ResponseEntity.ok(response);
                }

            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/saveWithTransaccion")
    public ResponseEntity<?> saveWithTransaccion(@RequestBody MovimientoDTO movimientoDTO) throws URISyntaxException {
        try {

            Optional<Usuario> optionalUser = userService.findByUsername(movimientoDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {

                Optional<Cuenta> optionalCuentaOrigen = cuentaService.findByIdSobre(movimientoDTO.getTransaccion().getCuentaOrigen().getSobre().getId());
                Optional<Cuenta> optionalCuentaDestino = cuentaService.findByIdSobre(movimientoDTO.getTransaccion().getCuentaDestino().getSobre().getId());
                if (optionalCuentaOrigen.isPresent() && optionalCuentaDestino.isPresent()) {

                    Cuenta cuentaOrigen = optionalCuentaOrigen.get();
                    Cuenta cuentaDestino = optionalCuentaDestino.get();
                    System.out.println("sobre origen " + cuentaOrigen.getSobre().getDescripcion());
                    System.out.println("sobre destino " + cuentaDestino.getSobre().getDescripcion());
                    Transaccion nTransaccion = movimientoDTO.getTransaccion();
                    nTransaccion.setCuentaOrigen(cuentaOrigen);
                    nTransaccion.setCuentaDestino(cuentaDestino);
                    movimientoDTO.setCuenta(cuentaOrigen);
                    movimientoDTO.setTransaccion(nTransaccion);
                    movimientoDTO.setUsuario(optionalUser.get());
                    transaccionService.saveOrUpdate(movimientoDTO.getTransaccion());
                    Optional<Transaccion> optionalTransaccion = transaccionService.findByIdAndChildren(transaccionService.findMaxId());
                    if (optionalTransaccion.isPresent()) {
                        Transaccion transaccion = optionalTransaccion.get();

                        movimientoDTO.setTransaccion(transaccion);
                        movimientoService.saveOrUpdate(movimientoDTOToMovimiento(movimientoDTO));
                        movimientoDTO.setCuenta(cuentaDestino);
                        String nTipoMov = movimientoDTO.getTipoMovimiento() + " de " + cuentaOrigen.getSobre().getDescripcion();
                        movimientoDTO.setTipoMovimiento(nTipoMov);
                        movimientoService.saveOrUpdate(movimientoDTOToMovimiento(movimientoDTO));
                    }


                    Response response = new Response();
                    response.setIdMessage("201");
                    response.setMessage("Registro creado con éxito.");
                    return ResponseEntity.ok(response);
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody MovimientoDTO movimientoDTO) throws URISyntaxException {
        Optional<Movimiento> optionalMovimiento = movimientoService.findById(id);
        if (optionalMovimiento.isPresent()) {
            Movimiento movimiento = optionalMovimiento.get();

            movimiento.setFecha(movimientoDTO.getFecha());
            movimiento.setTipoMovimiento(movimientoDTO.getTipoMovimiento());
            movimiento.setComentario(movimientoDTO.getComentario());
            movimiento.setMonto(movimientoDTO.getMonto());
            movimiento.setCuenta(movimientoDTO.getCuenta());
            movimiento.setTransaccion(movimientoDTO.getTransaccion());
            movimientoService.saveOrUpdate(movimiento);

            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro modificado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Response response = new Response();
        if (id != null) {
            movimientoService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }


    private MovimientoDTO movimientoToMovimientoDTO(Movimiento movimiento) {
        return MovimientoDTO.builder()
                .id(movimiento.getId())
                .fecha(movimiento.getFecha())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .comentario(movimiento.getComentario())
                .monto(movimiento.getMonto())
                .cuenta(movimiento.getCuenta())
                .transaccion(movimiento.getTransaccion())
                .usuario(movimiento.getUsuario())
                .build();
    }

    private Movimiento movimientoDTOToMovimiento(MovimientoDTO movimientoDTO) {
        return Movimiento.builder()
                .id(movimientoDTO.getId())
                .fecha(movimientoDTO.getFecha())
                .tipoMovimiento(movimientoDTO.getTipoMovimiento())
                .comentario(movimientoDTO.getComentario())
                .monto(movimientoDTO.getMonto())
                .cuenta(movimientoDTO.getCuenta())
                .transaccion(movimientoDTO.getTransaccion())
                .usuario(movimientoDTO.getUsuario())
                .build();
    }



    private MovimientoConsultaDTO movimientoToMovimientoConsultaDTO(Movimiento movimiento) {
        return MovimientoConsultaDTO.builder()
                .id(movimiento.getId())
                .fecha(movimiento.getFecha())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .comentario(movimiento.getComentario())
                .monto(movimiento.getMonto())
                .cuenta(movimiento.getCuenta())
                .transaccion(movimiento.getTransaccion())
                .usuario(movimiento.getUsuario())
                .build();
    }
}
