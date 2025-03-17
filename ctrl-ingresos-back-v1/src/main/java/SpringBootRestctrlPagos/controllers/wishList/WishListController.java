package SpringBootRestctrlPagos.controllers.wishList;

import SpringBootRestctrlPagos.controllers.dto.prestamos.PrestamoDTO;
import SpringBootRestctrlPagos.controllers.dto.wishList.WishListDTO;
import SpringBootRestctrlPagos.controllers.dto.wishList.WishListDetailDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.models.entities.wishList.WishList;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.prestamos.IPrestamoService;
import SpringBootRestctrlPagos.services.wishList.IWishListDetailService;
import SpringBootRestctrlPagos.services.wishList.IWishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/wish-list/wish-list")
public class WishListController {
    @Autowired
    private IWishListService wishListService;

    @Autowired
    private IWishListDetailService wishListDetailService;
    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findWLAndChildrenById(@PathVariable Long id) {
        Optional<WishList> optionalWishList = wishListService.findWLAndChildrenById(id);
        if (optionalWishList.isPresent()) {
            WishList wishList = optionalWishList.get();
            return ResponseEntity.ok(wishListToWishListDTO(wishList));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllPaginadoByUsername/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @PathVariable("state") String state,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<WishList> listadoPaginador =
                wishListService.findAllWithPaginationByUsername(cantidad, pagina, filter, username, state);

        return ResponseEntity.ok(listadoPaginador);
    }


    @GetMapping("/findAllFinAndChildrenByUser")
    public ResponseEntity<?> findAllFinAndChildrenByUser(@RequestParam String username) {
        List<WishListDTO> wishListDTOList = wishListService.findFinWithChildrenByUser(username)
                .stream()
                .map(wishList -> wishListToWishListDTO(wishList))
                .toList();
        return ResponseEntity.ok(wishListDTOList);
    }

    @GetMapping("/findAllNotFinAndChildrenByUser")
    public ResponseEntity<?> findAllNotFinAndChildrenByUser(@RequestParam String username) {
        List<WishListDTO> wishListDTOList = wishListService.findNotFinWithChildrenByUser(username)
                .stream()
                .map(wishList -> wishListToWishListDTO(wishList))
                .toList();
        return ResponseEntity.ok(wishListDTOList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody WishListDTO wishListDTO) throws URISyntaxException {
        WishList wishList = wishListDTOToWishList(wishListDTO);
        Optional<Usuario> optionalUser = userService.findByUsername(wishList.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            wishList.setUsuario(user);
            wishListService.saveOrUpdate(wishList);

            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro creado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody WishListDTO wishListDTO) throws URISyntaxException {
        System.out.println("entra en update id " + id);
        Optional<WishList> optionalWishList = wishListService.findWLAndChildrenById(id);
        if (optionalWishList.isPresent()) {
            System.out.println("encuentra");
            WishList oldWishList = optionalWishList.get();
            Optional<Usuario> optionalUser = userService.findByUsername(wishListDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                try {
                    Usuario user = optionalUser.get();
                    oldWishList.setUsuario(user);
                    oldWishList.setTitulo(wishListDTO.getTitulo());
                    oldWishList.setFechaCreacion(wishListDTO.getFechaCreacion());
                    oldWishList.setMeta(wishListDTO.getMeta());
                    oldWishList.setEstado(wishListDTO.isEstado());
                    oldWishList.setFechaFin(wishListDTO.getFechaFin());
                    oldWishList.setCuentaOrigen(wishListDTO.getCuentaOrigen());
                    oldWishList.setProcesarWish(wishListDTO.isProcesarWish());

                    wishListService.saveOrUpdate(oldWishList);
                    System.out.println("despues del update");
                    return ResponseEntity.ok(Response.builder()
                            .idMessage("202")
                            .message("Registro modificado con éxito").build());

                } catch (Exception e) {
                    System.out.println(e);
                    throw new RuntimeException(e);
                }
            }


        }
        System.out.println("da error");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/finalWish/{idWish}")
    public ResponseEntity<?> finalWish(
            @PathVariable Long idWish,
            @RequestBody WishListDTO wishDTO) throws URISyntaxException {
        try {
            Optional<WishList> optWish = wishListService.findWLAndChildrenById(idWish);
            if (optWish.isPresent()) {
                WishList oldW = optWish.get();
                List<WishListDetail> listDetails = wishListDetailService.findAllByIdWish(idWish);
                listDetails.forEach(wishListDetail -> {
                    WishListDetail nList = new WishListDetail();
                    if(!wishListDetail.isProcesarDetail()){
                        nList.setProcesarDetail(true);
                        nList.setWishDetailId(wishListDetail.getWishDetailId());
                        nList.setFechaDetail(wishListDetail.getFechaDetail());
                        nList.setLink(wishListDetail.getLink());
                        nList.setPrecio(wishListDetail.getPrecio());
                        nList.setComentario(wishListDetail.getComentario());
                        nList.setItemName(wishListDetail.getItemName());
                        wishListDetailService.saveOrUpdate(nList);
                    }
                });

                oldW.setProcesarWish(true);
                oldW.setFechaFin(new Date());
                oldW.setEstado(true);
                wishListService.saveOrUpdate(oldW);
                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/procesarWishList/{idWishList}")
    public ResponseEntity<?> procesarWishList(@PathVariable Long idWishList,
                                          @RequestBody WishListDTO wishListDTO) throws URISyntaxException {
        System.out.println("entra al procesar");
        try {
            Optional<WishList> optWL = wishListService.findWLAndChildrenById(idWishList);
            if (optWL.isPresent()) {
                WishList oldWL = optWL.get();

                oldWL.setProcesarWish(true);
                oldWL.setEstado(true);
                wishListService.saveOrUpdate(oldWL);

                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id != null) {
            wishListService.deleteById(id);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("203")
                    .message("Registro eliminado con éxito").build());
        }
        return ResponseEntity.badRequest().build();
    }


    private WishListDTO wishListToWishListDTO(WishList wishList) {
        return WishListDTO.builder()
                .id(wishList.getId())
                .wishListDetails(wishList.getWishListDetails())
                .titulo(wishList.getTitulo())
                .fechaCreacion(wishList.getFechaCreacion())
                .meta(wishList.getMeta())
                .cuentaOrigen(wishList.getCuentaOrigen())
                .estado(wishList.isEstado())
                .fechaFin(wishList.getFechaFin())
                .procesarWish(wishList.isProcesarWish())
                .usuario(Usuario.builder()
                        .id(wishList.getUsuario().getId())
                        .username(wishList.getUsuario().getUsername())
                        .role(wishList.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }

    private WishList wishListDTOToWishList(WishListDTO wishListDTO) {
        return WishList.builder()
                .id(wishListDTO.getId())
                .wishListDetails(wishListDTO.getWishListDetails())
                .titulo(wishListDTO.getTitulo())
                .fechaCreacion(wishListDTO.getFechaCreacion())
                .meta(wishListDTO.getMeta())
                .cuentaOrigen(wishListDTO.getCuentaOrigen())
                .estado(wishListDTO.isEstado())
                .fechaFin(wishListDTO.getFechaFin())
                .procesarWish(wishListDTO.isProcesarWish())
                .usuario(Usuario.builder()
                        .id(wishListDTO.getUsuario().getId())
                        .username(wishListDTO.getUsuario().getUsername())
                        .role(wishListDTO.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }
}
