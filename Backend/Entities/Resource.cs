namespace Backend.Entities;

public class Resource
{
    public int Id { get; set; }
    public string ResourceType { get; set; } = "";
    public string Title { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
