package SpringBootRestctrlPagos.controllers.ctrlEfectivo;

import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.TransaccionDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ITransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ctrlEfectivo/transacciones")
public class TransaccionController {
    @Autowired
    private ITransaccionService transaccionService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Transaccion> transaccionOptional = transaccionService.findByIdAndChildren(id);
        if (transaccionOptional.isPresent()) {
            Transaccion transaccion = transaccionOptional.get();
            TransaccionDTO transaccionDTO = transaccionToTransaccionDTO(transaccion);
            return ResponseEntity.ok(transaccionDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findAll")
    public ResponseEntity<?> findAll() {
        List<TransaccionDTO> transaccionList = transaccionService.findAllAndChildren()
                .stream()
                .map(transaccion -> transaccionToTransaccionDTO(transaccion))
                .toList();

        return ResponseEntity.ok(transaccionList);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody TransaccionDTO transaccionDTO) throws URISyntaxException {
        System.out.println("transaccionDTO.getCuentaOrigen() = " + transaccionDTO.getCuentaOrigen());
        System.out.println("transaccionDTO.getId() = " + transaccionDTO.getId());
        System.out.println("transaccionDTO.getCuentaDestino() = " + transaccionDTO.getCuentaDestino());
        System.out.println("transaccionDTO.getCuentaOrigen() = " + transaccionDTO.getCantidad());
        transaccionService.saveOrUpdate(transaccionDTOToTransaccion(transaccionDTO));
        Response response = new Response();
        response.setIdMessage("201");
        response.setMessage("Registro creado con éxito.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/saveAndReturnTransaccion")
    public ResponseEntity<?> saveByIdMax(@RequestBody TransaccionDTO transaccionDTO) throws URISyntaxException {
        transaccionService.saveOrUpdate(transaccionDTOToTransaccion(transaccionDTO));
        Optional<Transaccion> optionalTransaccion = transaccionService.findByIdAndChildren(transaccionService.findMaxId());
        if (optionalTransaccion.isPresent()){
            Transaccion transaccion = optionalTransaccion.get();
            return ResponseEntity.ok(transaccion);
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody TransaccionDTO transaccionDTO) throws URISyntaxException {
        Optional<Transaccion> optionalTransaccion = transaccionService.findById(id);
        if (optionalTransaccion.isPresent()) {
            System.out.println("encontro usuario");
            Transaccion transaccion = optionalTransaccion.get();

            transaccion.setCantidad(transaccionDTO.getCantidad());
            transaccion.setFecha(transaccionDTO.getFecha());
            transaccion.setCuentaOrigen(transaccionDTO.getCuentaOrigen());
            transaccion.setCuentaDestino(transaccionDTO.getCuentaDestino());

            transaccionService.saveOrUpdate(transaccion);

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
            transaccionService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }


    private TransaccionDTO transaccionToTransaccionDTO(Transaccion transaccion) {
        return TransaccionDTO.builder()
                .id(transaccion.getId())
                .cantidad(transaccion.getCantidad())
                .fecha(transaccion.getFecha())
                .cuentaOrigen(transaccion.getCuentaOrigen())
                .cuentaDestino(transaccion.getCuentaDestino())
                .build();
    }

    private Transaccion transaccionDTOToTransaccion(TransaccionDTO transaccionDTO) {
        return Transaccion.builder()
                .id(transaccionDTO.getId())
                .cantidad(transaccionDTO.getCantidad())
                .fecha(transaccionDTO.getFecha())
                .cuentaOrigen(transaccionDTO.getCuentaOrigen())
                .cuentaDestino(transaccionDTO.getCuentaDestino())
                .build();
    }


}
