package com.billingsoftware.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.billingsoftware.io.ItemRequest;
import com.billingsoftware.io.ItemResponse;

public interface ItemService {

    // add item method
    ItemResponse add(ItemRequest request, MultipartFile file);

    //get all items method
    List<ItemResponse> fetchItems();

    //delete item 
    void delete(String itemId);


}
