
Hệ thống denv của bên BS, đã hỗ trợ cài đặt được dễ dàng hơn cho người mới.
Trước các bên của bọn anh cũng có làm dựa trên default của docker-compose, vì bọn anh ít người nên việc này sẽ dễ tùy chỉnh cho các bạn.
Các bạn dev thì dễ gần, và cũng chịu lắng nghe.

Nhưng thật lòng mà nói vấn đề anh thấy chưa ổn nhất đó là về chất lượng sản phẩm (chỉ nói sản phẩm anh được tham gia vào phát triển) thì bên BS làm chưa tốt.
- Sản phẩm được chia thành quá nhiều repo dẫn đến việc khó kiểm soát.
  Upsell (Nextjs + API Express) + Warehouse (Nextjs + Api Express) + Settings Auth (Nextjs)
  => Thực sự anh không biết các bạn có được sự tư vấn, hỗ trợ thêm từ các Dev lv trên không, nhưng việc lựa chọn một cách phát triển mà cứ thêm tính năng lại phát sinh thêm các repo mới thì dần bạn team leader (technical) sẽ không thể quản lý hết được.
  Về việc mở rộng con người thì cũng không thể nào đáp ứng nổi khi cứ mở rộng kiểu này. Vì việc maintain 1 sản phẩm lại bị phụ thuộc và các repo còn lại, khi update lại phải copy code sang các bên còn lại để update chung. Dần sẽ dẫn đến 1-3 bạn sẽ tập trung vào 1 repo không hỗ trơ được nhau, khó có đủ time để review chéo để các bạn khác lên lv.  
  => việc này cũng không tốt cho việc phát triển kỹ năng về technical skill của team
   
  Hiện tại đa phần tính năng chính sẽ tập trung vào 2 con Nextjs Upsell-Warehouse Nextjs.
  => Việc lựa chọn kiến trúc tập chung chủ yếu vào Nextjs từ Nextjs save thẳng tới DB. 
  Sử dụng Nextjs là tốt cho FE nhưng việc tập trung hoàn toàn đẩy toàn bộ BE của sản phẩm vào Nextjs và cho kết nối trực tiếp NextJS với DB là một kiến trúc không ổn định 
  => Kiến trúc này của Nextjs chỉ phù hợp cho các ứng dụng dạng blog or dev mode, không phù hợp để build các hệ thống quản lý ERP, CRM, Inventory ...
  Kiến trúc này nó cũng dễ làm cho FE nó bị phình to ra về source code nên khi dùng về sau sẽ xẩy ra nhiều vấn đề về maintain và mở rộng.
  Khó kiểm soát về caching, về phân quyền ... 
  
- Chất lượng dev còn khá trẻ nên non kinh nghiệm và các bạn đa phần cũng chỉ làm xong tickets được giao.
- Từ vấn đề Dev trẻ và non kinh nghiệm nhưng lựa chọn API theo thuần express, các bạn chưa đủ khả năng để kiến trúc và làm nên thiếu tầng xử lý data, cache .... 
  => Dù cảm giác việc này lúc đầu sẽ rất nhanh triển khai, nhưng thực sự đến khi đưa vào sản phẩm production ở thực tế việc các bạn ấy thường bỏ qua rất nhiều giai đoạn và code không được sử dụng lại nhiểu khiến các bạn sẽ có những đoạn code lặp đi lặp lại.
  Việc khai báo phụ thuộc và không phụ thuộc cũng hạn chế tạo mới đối tượng ... sẽ bị lặp lại ở nhiều chỗ và không kiểm saots được.
  => Nên lựa chọn các framework build đc các tầng logic sẵn như Nest, TS.ED và đội core của BS nên dần đẩy kiến trúc và hướng dẫn cho các team bên dưới.
  Việc lựa chọn sẵn các cũng sẽ đỡ xẩy ra các lỗi phức tạp do các bạn không thể tự kiến trúc được như cache, db, DI, object pool, auth, acl ... và cũng hạn chế việc bị lặp đi lặp lại các đoạn code chỉ để tạo dữ liệu.
- Database các bạn dev chưa biết kiến trúc về data nhiều nên việc thiết kế chung bị phụ thuộc khá nhiều khi mở rộng và thêm tính năng, thêm người mới sẽ lại tạo thêm bảng dữ liệu việc tạo dữ liệu phụ thuộc quá nhiều table.
  => cái này nên có một lược đồ chung để team triển khai theo thêm bảng thì nên được xác nhận.
  Dần sản phẩm nên loại bỏ một phần foriegn key, các dữ liệu phụ thuộc vào nhau để tăng tốc độ truy vấn và dễ dàng cập nhật sửa đổi, cũng dễ dàng kiểm soát hơn khi có lỗi xẩy ra.




