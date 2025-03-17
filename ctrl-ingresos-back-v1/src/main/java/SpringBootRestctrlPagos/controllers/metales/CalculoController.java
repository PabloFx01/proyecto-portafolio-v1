package SpringBootRestctrlPagos.controllers.metales;


import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/compra/calculo")
@CrossOrigin(origins = {"http://localhost:4200"})
public class CalculoController {
    @Autowired
    private ICalculosService calculosService;
    @Autowired
    private ICompraService compraService;

    @GetMapping("/calcularInventarioByIdCompra/{idCompra}")
    public ResponseEntity<?> calcularInventarioByIdCompra(@PathVariable Long idCompra) {
        Optional<Compra> compraOptional = compraService.findByIdAndChildren(idCompra);
        if (compraOptional.isPresent()) {
            Response response = new Response();
            calculosService.calcularInventarioByIdCompra(idCompra);
            response.setIdMessage("200");
            response.setMessage("El calculo se realizo correctamente");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/calcularImporteTotalTicketByIdTicket/{idTicket}")
    public ResponseEntity<?> calcularImporteTotalTicketByIdTicket(@PathVariable Long idTicket) {
        try {
            Response response = new Response();
            calculosService.calcularImporteTotalTicketByIdTicket(idTicket);
            response.setIdMessage("200");
            response.setMessage("El calculo se realizo correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/calcularVentaByIdVenta/{idVenta}")
    public ResponseEntity<?> calcularVentaByIdVenta(@PathVariable Long idVenta) {
        try {
            Response response = new Response();
            calculosService.calcularVentaByIdVenta(idVenta);
            Thread.sleep(1000);
            response.setIdMessage("200");
            response.setMessage("El calculo se realizo correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.notFound().build();
        }
    }


}
