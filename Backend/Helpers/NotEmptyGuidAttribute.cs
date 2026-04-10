using System.ComponentModel.DataAnnotations;

namespace Backend.Helpers;

public class NotEmptyGuidAttribute : ValidationAttribute
{
    public override bool IsValid(object value)
    {
        if (value is Guid guid)
        {
            return guid != Guid.Empty;
        }
        return true; // Let [Required] handle nulls if applicable
    }
}
