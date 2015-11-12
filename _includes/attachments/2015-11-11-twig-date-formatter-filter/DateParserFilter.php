<?php

class DateParserFilter extends \Twig_Extension
{
    public function getFilters ()
    {
        return array(
            new \Twig_SimpleFilter('parse_date', array($this, 'parseDate'))
        );
    }

    public function parseDate ($string, $formats)
    {
        if (is_string($formats))
        {
            $formats = array($formats);
        }

        foreach ($formats as $format)
        {
            $dateTime = \DateTime::createFromFormat($format, $string);

            if ($dateTime !== false)
            {
                return $dateTime;
            }
        }

        return $string;
    }

    public function getName ()
    {
        return "parse_date";
    }
}
