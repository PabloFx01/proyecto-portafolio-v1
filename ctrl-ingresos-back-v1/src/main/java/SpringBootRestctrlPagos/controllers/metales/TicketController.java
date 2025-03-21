package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/venta/ticket")
public class TicketController {
    @Autowired
    private ITicketService ticketService;
    @Autowired
    private ICalculosService calculosService;
    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Ticket> ticketOptional = ticketService.findByIdAndChildren(id);
        if (ticketOptional.isPresent()) {
            Ticket ticket = ticketOptional.get();
            TicketDTO ticketDTO = ticketToTicketDTO(ticket);
            return ResponseEntity.ok(ticketDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findMaxId")
    public ResponseEntity<?> findMaxId() {
        Long maxId = ticketService.findMaxId();
        if (maxId != null) {
            return ResponseEntity.ok(maxId);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(@RequestParam String username) {
        List<TicketDTO> ticketList = ticketService.findAllAndChildren(username)
                .stream()
                .map(ticket -> ticketToTicketDTO(ticket))
                .toList();
        return ResponseEntity.ok(ticketList);
    }

    @GetMapping("/findAllAndChildrenNotUsed")
    public ResponseEntity<?> findAllAndChildrenNotUsed(@RequestParam String username) {
        List<TicketDTO> ticketList = ticketService.findAllAndChildrenNotUsed(username)
                .stream()
                .map(ticket -> ticketToTicketDTO(ticket))
                .toList();
        return ResponseEntity.ok(ticketList);
    }

    @GetMapping("/findAllPaginado/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Ticket> listadoPaginador =
                ticketService.findAllWithPagination(cantidad, pagina, filter, username);
        List<TicketDTO> ticketDTOList = listadoPaginador.getElementos()
                .stream()
                .map(ticket -> ticketToTicketDTO(ticket))
                .collect(Collectors.toList());

        ListadoPaginador<TicketDTO> ticketDTOListadoPaginador = new ListadoPaginador<>();
        ticketDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        ticketDTOListadoPaginador.setElementos(ticketDTOList);

        return ResponseEntity.ok(ticketDTOListadoPaginador);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody TicketDTO ticketDTO) throws URISyntaxException {

        try {
            Ticket ticket = ticketDTOToTicket(ticketDTO);
            Optional<Usuario> optionalUser = userService.findByUsername(ticket.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Usuario user = optionalUser.get();
                ticket.setUsuario(user);
                ticketService.saveOrUpdate(ticket);
                Response response = new Response("200", "Creado correctamente.");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody TicketDTO ticketDTO) throws URISyntaxException {
        Optional<Ticket> ticketOptional = ticketService.findById(id);
        if (ticketOptional.isPresent()) {
            Ticket ticket = ticketOptional.get();
            ticket.setDescripcion(ticketDTO.getDescripcion());
            ticket.setFechaTicket(ticketDTO.getFechaTicket());
            if(!ticketDTO.isUsed()){
                ticket.setUsed(ticketDTO.isUsed());
            }
            ticket.setEditadoPor(ticketDTO.getEditadoPor());
            ticket.setModificadoEl(ticketDTO.getModificadoEl());

            ticketService.saveOrUpdate(ticket);
            Response response = new Response("200", "Actualizado correctamente.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Response response = new Response();
        if (id != null) {
            ticketService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private TicketDTO ticketToTicketDTO(Ticket ticket) {
        return TicketDTO.builder()
                .id(ticket.getId())
                .descripcion(ticket.getDescripcion())
                .fechaTicket(ticket.getFechaTicket())
                .detalleTicket(ticket.getDetalleTicket())
                .importeTotal((ticket.getImporteTotal()))
                .used(ticket.isUsed())
                .editadoPor(ticket.getEditadoPor())
                .modificadoEl(ticket.getModificadoEl())
                .usuario(ticket.getUsuario())
                .build();
    }

    private Ticket ticketDTOToTicket(TicketDTO ticketDTO) {
        return Ticket.builder()
                .id(ticketDTO.getId())
                .descripcion(ticketDTO.getDescripcion())
                .fechaTicket(ticketDTO.getFechaTicket())
                .detalleTicket(ticketDTO.getDetalleTicket())
                .importeTotal((ticketDTO.getImporteTotal()))
                .used(ticketDTO.isUsed())
                .editadoPor(ticketDTO.getEditadoPor())
                .modificadoEl(ticketDTO.getModificadoEl())
                .usuario(ticketDTO.getUsuario())
                .build();
    }


}
