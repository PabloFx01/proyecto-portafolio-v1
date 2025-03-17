package SpringBootRestctrlPagos.controllers.ctrlEfectivo;


import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.CuentaDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ICuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ctrlEfectivo/cuentas")

public class CuentaController {
    @Autowired
    private ICuentaService cuentaService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Cuenta> cuentaOptional = cuentaService.findById(id);
        if (cuentaOptional.isPresent()) {
            Cuenta cuenta = cuentaOptional.get();
            CuentaDTO cuentaDTO = cuentaToCuentaDTO(cuenta);
            return ResponseEntity.ok(cuentaDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findByIdSobre/{id}")
    public ResponseEntity<?> findByIdSobre(@PathVariable Long id) {
        Optional<Cuenta> cuentaOptional = cuentaService.findByIdSobre(id);
        if (cuentaOptional.isPresent()) {
            Cuenta cuenta = cuentaOptional.get();
            CuentaDTO cuentaDTO = cuentaToCuentaDTO(cuenta);
            return ResponseEntity.ok(cuentaDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findAll")
    public ResponseEntity<?> findAll() {
        List<CuentaDTO> cuentaList = cuentaService.findAll()
                .stream()
                .map(cuenta -> cuentaToCuentaDTO(cuenta))
                .toList();

        return ResponseEntity.ok(cuentaList);
    }

    @GetMapping("/findAllFromSobreActByUsername")
    public ResponseEntity<?> findAllFromSobreActByUsername(@RequestParam(required = false) String filter, @RequestParam String username) {
        List<CuentaDTO> cuentaList = new ArrayList<>();
        if (!filter.equals("not")) {
            cuentaList = cuentaService.findAllFromSobreActByUsername(username)
                    .stream()
                    .filter(cuenta -> cuenta.getSobre().getDescripcion().toLowerCase().equals(filter.toLowerCase()))
                    .map(cuenta -> cuentaToCuentaDTO(cuenta))
                    .toList();
        } else {
            cuentaList = cuentaService.findAllFromSobreActByUsername(username)
                    .stream()
                    .map(cuenta -> cuentaToCuentaDTO(cuenta))
                    .toList();
        }

        return ResponseEntity.ok(cuentaList);
    }

    @GetMapping("/findAllPaginadoByUsername/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPaginationByUsername(@PathVariable("cantidad") Long cantidad,
                                                         @PathVariable("pagina") int pagina,
                                                         @RequestParam(required = false) String filter,
                                                         @RequestParam(required = false) String username) {
        ListadoPaginador<Cuenta> listadoPaginador =
                cuentaService.findAllWithPaginationByUsername(cantidad, pagina, filter, username);

        return ResponseEntity.ok(listadoPaginador);
    }


    //@PostMapping("/save")
    @GetMapping("/save")
    //public ResponseEntity<?> save(@RequestBody CuentaDTO cuentaDTO) throws URISyntaxException {
    public ResponseEntity<?> save() throws URISyntaxException {
       // cuentaService.saveOrUpdate(cuentaDTOToCuenta(cuentaDTO));
        System.out.println("entra en cuenta");
        Response response = new Response();
        response.setIdMessage("201");
        response.setMessage("Registro creado con éxito.");
        return ResponseEntity.ok(response);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Cuenta cuenta) throws URISyntaxException {
        System.out.println("entra al metodo cuenta");
        Optional<Cuenta> optionalCuenta = cuentaService.findByIdSobre(id);
        if (optionalCuenta.isPresent()) {
            System.out.println("encontro usuario");
            Cuenta oldCuenta = optionalCuenta.get();
            Double saldoActual = oldCuenta.getSaldo();
            Double nMonto = cuenta.getSaldo();
            Double nSaldo = saldoActual + nMonto;
            oldCuenta.setSaldo(nSaldo);
            cuentaService.saveOrUpdate(oldCuenta);

            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro modificado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();


    }
    @PutMapping("/updateRetirarFondo/{id}")
    public ResponseEntity<?> updateRetirarFondo(@PathVariable Long id,
                                    @RequestBody Cuenta cuenta) throws URISyntaxException {
        System.out.println("entra al metodo cuenta");
        Optional<Cuenta> optionalCuenta = cuentaService.findByIdSobre(id);
        if (optionalCuenta.isPresent()) {
            System.out.println("encontro usuario");
            Cuenta oldCuenta = optionalCuenta.get();
            Double saldoActual = oldCuenta.getSaldo();
            Double nMonto = cuenta.getSaldo();
            Double nSaldo = saldoActual - nMonto;
            oldCuenta.setSaldo(nSaldo);
            cuentaService.saveOrUpdate(oldCuenta);

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
            cuentaService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private CuentaDTO cuentaToCuentaDTO(Cuenta cuenta) {
        return CuentaDTO.builder()
                .id(cuenta.getId())
                .saldo(cuenta.getSaldo())
                .sobre(cuenta.getSobre())
                .build();
    }

    private Cuenta cuentaDTOToCuenta(CuentaDTO cuentaDTO) {
        return Cuenta.builder()
                .id(cuentaDTO.getId())
                .saldo(cuentaDTO.getSaldo())
                .sobre(cuentaDTO.getSobre())
                .build();
    }

}
